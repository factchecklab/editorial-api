import {
  save as saveElastic,
  remove as removeElastic,
} from '../../search/topic-submission';
import { modelToAirtable } from '../../airtable/topic-submission';

const init = ({ TopicSubmission }, context, hookOptions) => {
  let { disableAirtable } = hookOptions || {};
  const { airtable, elastic, logger } = context;

  if (!disableAirtable && !process.env.AIRTABLE_API_KEY) {
    logger.info(
      'Airtable hook disabled because AIRTABLE_API_KEY is not configured.'
    );
    disableAirtable = true;
  }

  TopicSubmission.addHook('afterSave', async (topicSubmission, options) => {
    const hook = async () => {
      if (!disableAirtable) {
        try {
          await modelToAirtable(
            airtable,
            topicSubmission,
            { hooks: false },
            context
          );
        } catch (error) {
          logger.error(
            `Error occurred while saving TopicSubmission with ID %d to airtable: %s`,
            topicSubmission.id,
            error
          );
        }
      }

      try {
        await saveElastic(elastic, topicSubmission, { hooks: false });
      } catch (error) {
        logger.error(
          `Error occurred while indexing TopicSubmission with ID %d: %s`,
          topicSubmission.id,
          error
        );
      }
    };

    if (options.transaction) {
      await options.transaction.afterCommit(hook);
    } else {
      await hook();
    }
  });

  TopicSubmission.addHook('afterDestroy', async (topicSubmission, options) => {
    const hook = async () => {
      try {
        await removeElastic(elastic, topicSubmission, { hooks: false });
      } catch (error) {
        logger.error(
          `Error occurred while removing index for TopicSubmission with ID %d: %s`,
          topicSubmission.id,
          error
        );
      }
    };

    if (options.transaction) {
      await options.transaction.afterCommit(hook);
    } else {
      await hook();
    }
  });
};

export default init;
