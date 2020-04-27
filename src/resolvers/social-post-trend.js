const esQueryObject = (keyword) => {
  /* eslint-disable camelcase */
  const queryObject = {
    bool: {
      must: [{ range: { created_at: { from: 'now-30d' } } }],
    },
  };
  /* eslint-enable camelcase */

  if (keyword) {
    queryObject.bool.must.push({ match: { content: keyword } });
  }
  return queryObject;
};

export default {
  Query: {
    socialPostTrend: async (parent, args, { elastic }) => {
      // TODO (samueltangz): support more arguments apart from `keyword`
      // TODO (samueltangz): I think the histogram is bucketed per day in GMT+0.
      // Need to discuss if histogram buckets can be customizable.

      /* eslint-disable camelcase */
      const { body } = await elastic.search({
        index: 'social-posts-*',
        size: 0,
        body: {
          query: esQueryObject(args.keyword),
          aggs: {
            posts_over_time: {
              date_histogram: {
                field: 'created_at',
                calendar_interval: '1d',
              },
            },
          },
        },
      });
      /* eslint-enable camelcase */
      const dataPoints = body.aggregations.posts_over_time.buckets.map(
        (bucket) => {
          return {
            time: new Date(bucket.key),
            value: bucket.doc_count,
          };
        }
      );
      const sumValue = dataPoints.reduce((accumulator, dataPoint) => {
        return accumulator + dataPoint.value;
      }, 0);

      return {
        dataPoints,
        total: sumValue,
      };
    },
  },
};
