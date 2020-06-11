import { generateAssetUrl, uploadAssetFromUrl } from '../util/asset';

const getTable = (client, { logger }) => {
  const baseId = process.env.AIRTABLE_EDITORIAL_BASE_ID;
  if (!baseId) {
    throw new Error('AIRTABLE_EDITORIAL_BASE_ID is not configured');
  }
  return client.base(baseId).table('Topics');
};

export const modelToAirtable = async (client, submission, options, context) => {
  const { sequelize, storage, logger } = context;
  const table = getTable(client, context);

  if (submission.isDuplicate) {
    return;
  }

  const attachments = await submission.getAttachments();
  const recordData = {
    Content: submission.message,
    'Content URL': submission.url,
    'Submitter Comment': submission.comment,
    Status: submission.status,
    'Duplicate Count': submission.duplicateCount,
    Attachments: await Promise.all(
      attachments.map(async (attachment) => {
        if (attachment.airtableId) {
          // existing attachment
          return {
            id: attachment.airtableId,
          };
        }

        // new attachments
        const asset = await attachment.getAsset();
        return {
          url: await generateAssetUrl(storage, asset, {}),
          filename: asset.filename,
        };
      })
    ),
  };

  // update or create airtable
  let newRecord;
  if (submission.airtableId) {
    logger.debug(
      'Submitted topic %d has airtable ID %s, updating.',
      submission.id,
      submission.airtableId
    );
    newRecord = await table.update(submission.airtableId, recordData);
    logger.debug(
      'Airtable record %s updated for submitted topic %d.',
      newRecord.id,
      submission.id
    );
  } else {
    logger.debug(
      'Submitted topic %d does not have an airtable ID, creating.',
      submission.id
    );
    newRecord = await table.create(recordData);
    logger.debug(
      'Airtable record %s created for submitted topic %d',
      newRecord.id,
      submission.id
    );
  }

  // update model with airtable ID and last modified time
  await sequelize.transaction(async (t) => {
    const opts = { ...options, transaction: t };

    await submission.setAirtableMeta(
      {
        id: newRecord.id,
        updatedAt: new Date(newRecord.fields['Last Modified Time']),
      },
      opts
    );

    logger.debug(`Submitted topic %d updated.`, submission.id);

    const attachmentsInRecord = newRecord.fields.Attachments || [];
    if (attachments.length === attachmentsInRecord.length) {
      // Assume that the order of our attachments is the same as that of theirs
      await Promise.all(
        attachmentsInRecord.map(async (airtableAttachment, index) => {
          const ourAttachment = attachments[index];
          await ourAttachment.setAirtableMeta(
            {
              id: airtableAttachment.id,
            },
            opts
          );
        })
      );
    }
  });
};

export const airtableToModel = async (record, options, context) => {
  const { sequelize, storage, models, logger } = context;
  logger.debug(`Got submitted topic record ${record.id}.`);

  const modelData = {
    message: record.fields['Content'],
    url: record.fields['Content URL'],
    comment: record.fields['Submitter Comment'],
  };

  const airtableMeta = {
    id: record.id,
    updatedAt: new Date(record.fields['Last Modified Time']),
  };

  // find existing submitted topic and prepare for update data
  let submission = await models.TopicSubmission.findByAirtableId(record.id);

  let attachments = [];

  // create a new submission or update an existing submission
  if (submission) {
    logger.debug(
      `Found existing topic submission model ${submission.id}, updating`
    );
    submission.set(modelData);
    attachments = await submission.getAttachments();
  } else {
    logger.debug(`Creating new topic submission model for airtable record`);
    submission = models.TopicSubmission.build(modelData);
  }

  // attachments
  const airtableAttachments = record.fields['Attachments'] || [];

  // find new attachments to create
  const attachmentsToCreate = await Promise.all(
    airtableAttachments
      .filter((attachment) => {
        return (
          attachments.findIndex((att) => att.airtableId === attachment.id) ===
          -1
        );
      })
      .map(async (attachment) => {
        let asset = models.Asset.build(
          await uploadAssetFromUrl(storage, attachment.url, {
            filename: attachment.filename,
            contentType: attachment.type,
          })
        );

        // the asset is saved to database first to obtain an asset id
        // this operation is not part of a transaction
        asset = await asset.save({ returning: true });

        return models.Attachment.build({
          assetId: asset.id,
          metadata: {
            airtable: {
              id: attachment.id,
            },
          },
        });
      })
  );

  // find existing attachments to destroy
  const attachmentsToDestroy = attachments.filter((attachment) => {
    return (
      airtableAttachments.findIndex(
        (att) => att.id === attachment.airtableId
      ) === -1
    );
  });

  // commit to database
  return sequelize.transaction(async (t) => {
    const opts = { transaction: t };
    submission = await submission.save({ ...opts, returning: true });
    await submission.setAirtableMeta(airtableMeta, opts);

    await Promise.all(
      attachmentsToCreate.map((attachment) => {
        attachment.itemId = submission.id;
        attachment.itemType = 'topic-submission';
        return attachment.save(opts);
      })
    );
    await Promise.all(
      attachmentsToDestroy.map((attachment) => {
        return attachment.destroy(opts);
      })
    );
    return submission;
  });
};

export const fetchAndUpdate = async (client, date, context) => {
  const { logger } = context;
  const table = getTable(client, context);

  const selectOptions = {
    sort: [{ field: 'Last Modified Time', direction: 'asc' }],
  };

  if (date) {
    selectOptions.filterByFormula = `{Last Modified Time} > '${date.toISOString()}'`;
  } else {
    selectOptions.filterByFormula = `{Last Modified Time}`;
  }

  const query = table.select(selectOptions);

  logger.debug('Querying airtable for submitted topic records');
  let recordCount = 0;
  let errorCount = 0;
  await query.eachPage(async (records, fetchNextPage) => {
    logger.debug(`Got ${records.length} records from airtable`);
    await Promise.all(
      records.map(async (record) => {
        try {
          return await airtableToModel(record, {}, context);
        } catch (error) {
          logger.debug(JSON.stringify(record));
          logger.error('Error occurred while calling airtableToModel: ', error);
          errorCount += 1;
        }
      })
    );
    recordCount += records.length;

    logger.debug('Attempt to fetch next page');
    fetchNextPage();
  });

  logger.info(
    `Fetched ${recordCount} topic submissions  and updated with ${errorCount} errors.`
  );
};

export const saveNew = async (client, context) => {
  const { logger, models } = context;

  const submissions = await models.TopicSubmission.findAllWithoutAirtableId();

  let submissionCount = 0;
  let errorCount = 0;
  await Promise.all(
    submissions
      .filter((s) => !s.isDuplicate)
      .map(async (s) => {
        try {
          submissionCount += 1;
          return await modelToAirtable(client, s, {}, context);
        } catch (error) {
          logger.error('Error occurred while calling modelToAirtable: ', error);
          errorCount += 1;
        }
      })
  );

  logger.info(
    `Found ${submissionCount} topic submissions without airtable ID and saving to airtable, with ${errorCount} errors.`
  );
};
