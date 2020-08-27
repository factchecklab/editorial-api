// SPDX-FileCopyrightText: 2020 tech@factchecklab <tech@factchecklab.org>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

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
        1
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
        let duplicate = null;
        if (docs.length > 0) {
          duplicate = await models.TopicSubmission.findByPk(
            docs[0]._source.id,
            options
          );
          if (duplicate) {
            duplicate = await duplicate.findRootDuplicate();
            logger.debug(
              'The new submission is a duplicate of %d.',
              duplicate.id
            );
          } else {
            logger.warn(
              'Topic submission %d not found in database',
              docs[0]._source.id
            );
          }
        }

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
