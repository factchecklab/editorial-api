import {
  verify as verifyAssetToken,
  AssetTokenError,
} from '../util/asset-token';
import { ValidationError } from 'apollo-server-koa';
import { cleanUrl } from '../util/url';

export default {
  Mutation: {
    submitTopic: async (
      parent,
      { input },
      { models, search, elastic, sequelize, logger }
    ) => {
      const {
        message,
        source,
        url,
        comment,
        attachments: attachmentInputs,
      } = input;

      const docs = await search.TopicSubmission.searchSimilarByContent(
        elastic,
        message,
        url ? cleanUrl(url) : undefined,
        0,
        5
      );
      logger.debug('Found %d similar topic submissions.', docs.length);

      const attachments = await Promise.all(
        (attachmentInputs || []).map(async (attachmentInput) => {
          const { assetToken } = attachmentInput;
          try {
            return {
              assetId: await verifyAssetToken(assetToken),
            };
          } catch (error) {
            if (error instanceof AssetTokenError) {
              throw new ValidationError(error.toString());
            }
            throw error;
          }
        })
      );

      return sequelize.transaction(async (t) => {
        const options = { transaction: t };
        let duplicate =
          docs.length > 0
            ? await models.TopicSubmission.findByPk(docs[0]._source.id, options)
            : null;

        duplicate = duplicate ? await duplicate.findRootDuplicate() : null;

        let submittedTopic = models.TopicSubmission.build(
          {
            message,
            source,
            url,
            comment,
            attachments,
            duplicateId: duplicate ? duplicate.id : null,
          },
          { include: ['attachments'] }
        );
        submittedTopic = await submittedTopic.save({
          ...options,
          returning: true,
        });

        if (duplicate) {
          await duplicate.updateDuplicateCount(options);
          await duplicate.save(options);
        }

        return { submittedTopic };
      });
    },
  },

  SubmittedTopic: {
    attachments: (obj, args, { models }) => {
      return obj.getAttachments();
    },
  },
};
