const INDEX_NAME = 'editorial-topic-submissions';
const MIN_MORE_LIKE_THIS_SCORE = 5;

const documentId = (id) => {
  return `topicsubmission_${id}`;
};

export const save = async (client, report, options) => {
  // Create a new object with some keys removed from dataValues.
  /* eslint-disable no-unused-vars */
  const { id, duplicateId, metadata, attachments, ...rest } = report.dataValues;
  /* eslint-enable no-unused-vars */

  const body = {
    ...rest,
    id,
    '@timestamp': new Date(),
  };

  await client.index({
    index: INDEX_NAME,
    id: documentId(id),
    body,
  });
};

export const remove = async (client, { id }, options) => {
  await client.delete({
    index: INDEX_NAME,
    id: documentId(id),
  });
};

export const searchSimilarByContent = async (
  client,
  message,
  url,
  offset,
  limit
) => {
  const shouldClauses = [];

  if (message) {
    shouldClauses.push({
      /* eslint-disable camelcase */
      more_like_this: {
        fields: ['message'],
        like: message,
        min_term_freq: 1,
        max_query_terms: 12,
        min_doc_freq: 1,
        analyzer: 'cantonese_search',
      },
      /* eslint-enable camelcase */
    });
  }

  if (url) {
    shouldClauses.push({
      terms: {
        'url.keyword': [url],
        // Normally it returns 1 if matched.
        // Returns MIN_MORE_LIKE_THIS_SCORE so that it is not filter away.
        boost: MIN_MORE_LIKE_THIS_SCORE,
      },
    });
  }

  const query = {
    bool: {
      should: shouldClauses,
    },
  };

  const { body } = await client.search({
    index: INDEX_NAME,
    from: offset,
    size: limit,
    body: { query },
    // eslint-disable-next-line camelcase
    ignore_unavailable: true,
  });

  return body.hits.hits.filter((doc) => doc._score >= MIN_MORE_LIKE_THIS_SCORE);
};

export default {
  save,
  remove,
  searchSimilarByContent,
};
