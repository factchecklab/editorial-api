import gql from 'graphql-tag';
import { print } from 'graphql';

export default {
  settings: {
    'editor.theme': 'light',
  },
  tabs: [
    {
      name: 'Submit topic',
      responses: ['{}'],
      endpoint:
        process.env.GRAPHQL_PLAYGROUND_ENDPOINT ||
        'https://api.factchecklab.org/graphql/editorial',
      query: [
        '# Submit a fake news topic',
        print(gql`
          # Submit a topic
          mutation {
            submitTopic(input: { message: "Demo" }) {
              submittedTopic {
                id
                isDuplicate
              }
            }
          }
        `),
      ].join('\n'),
    },
    {
      name: 'Search related reports',
      responses: ['{}'],
      endpoint: '',
      query: [
        '# Search related reports',
        print(gql`
          query {
            searchRelatedReports(originalMessage: "Demo") {
              nodes {
                summary
                explanation
              }
            }
          }
        `),
      ].join('\n'),
    },
  ],
};
