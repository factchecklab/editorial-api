import {
  verify as verifyAssetToken,
  AssetTokenError,
} from '../util/asset-token';
import { ValidationError } from 'apollo-server-koa';

export default {
  Mutation: {
    submitTopic: async (parent, { input }, context) => {
      const { models } = context;
      const {
        content,
        source,
        url,
        attachments: attachmentInputs,
        // relatedTopicId,  // TODO(cheungpat)
      } = input;

      const attachments = await Promise.all(
        (attachmentInputs || []).map((attachmentInput) => {
          return (async () => {
            const { type, location, assetToken } = attachmentInput;
            if (type === 'url') {
              return {
                type,
                location,
              };
            } else if (type === 'asset') {
              try {
                return {
                  type,
                  assetId: await verifyAssetToken(assetToken),
                };
              } catch (error) {
                if (error instanceof AssetTokenError) {
                  throw new ValidationError(error.toString());
                }
                throw error;
              }
            } else {
              throw new Error(`Unexpected attachment type ${type}.`);
            }
          })();
        })
      );

      const submittedTopic = models.Report.build(
        { content, source, url, attachments },
        { include: ['attachments'] }
      );
      await submittedTopic.save({ returning: true });
      return { submittedTopic };
    },
  },

  SubmittedTopic: {
    attachments: (obj, args, { models }) => {
      return obj.getAttachments();
    },
  },
};
