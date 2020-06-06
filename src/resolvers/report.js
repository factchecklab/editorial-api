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
    coverImage: (topic, args, { models }) => {
      return topic.getCoverImage();
    },
  },
};
