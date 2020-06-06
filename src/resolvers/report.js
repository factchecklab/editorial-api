export default {
  Query: {
    searchRelatedReports: async (
      parent,
      {
        content,
        // url  // TODO(cheungpat)
      },
      { models, search, elastic }
    ) => {
      const ids = await search.Topic.searchSimilarByMessageContent(
        elastic,
        content
      );
      const result = await models.Topic.findAllByDocumentIds(ids);
      const edges = result.map((report) => {
        return {
          node: report,
        };
      });

      return {
        edges,
        nodes: edges.map((edge) => edge.node),
      };
    },
  },

  Report: {
    message: (topic, args, { models }) => {
      return topic.getMessage();
    },

    responses: (topic, { includeUnpublished }, { models }) => {
      if (includeUnpublished) {
        return topic.getResponses({ scope: null });
      } else {
        return topic.getResponses();
      }
    },

    coverImage: (topic, args, { models }) => {
      return topic.getCoverImage();
    },
  },
};
