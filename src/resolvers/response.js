import { NotFound } from './errors';

export default {
  Mutation: {
    createResponse: (parent, { input }, { sequelize, models }) => {
      const { topicId, entityId, ...rest } = input;

      return sequelize.transaction(async (t) => {
        const opts = { transaction: t };
        const topic = await models.Topic.findByPk(topicId, opts);
        if (!topic) {
          throw new NotFound(`Could not find a Topic with the id '${topicId}'`);
        }
        const entity = await models.Entity.findByPk(entityId, opts);
        if (!entity) {
          throw new NotFound(
            `Could not find a Entity with the id '${entityId}'`
          );
        }

        const response = models.Response.build({
          type: 'response',
          conclusion: 'uncertain',
          content: '',
          ...rest,
          entityId: entityId,
          topicId: topicId,
        });

        return { response: await response.save({ ...opts, returning: true }) };
      });
    },

    updateResponse: (parent, { input }, { models, sequelize }) => {
      const { id, ...rest } = input;

      return sequelize.transaction(async (t) => {
        const opts = { transaction: t };

        const response = await models.Response.findByPk(id, opts);
        if (!response) {
          throw new NotFound(`Could not find a Response with the id '${id}'`);
        }
        return {
          response: await response.update(rest, { ...opts, returning: true }),
        };
      });
    },

    deleteResponse: (parent, { input }, { models, sequelize }) => {
      const { id } = input;
      return sequelize.transaction(async (t) => {
        const opts = { transaction: t };
        const response = await models.Response.findByPk(id, opts);
        if (!response) {
          throw new NotFound(`Could not find a Response with the id '${id}'`);
        }
        await response.destroy(opts);
        return { responseId: id };
      });
    },
  },

  Response: {
    entity: (response, args, { models }) => {
      return response.getEntity();
    },
    // topic: (response, args, { models }) => {
    //   return response.getTopic();
    // },
    attachments: (response, args, { models }) => {
      return response.getAttachments();
    },
  },
};
