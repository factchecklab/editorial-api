import gql from 'graphql-tag';

import directives from './directives';
import pagination from './pagination';
import attachment from './attachment';
import asset from './asset';
import topicSubmission from './topic-submission';

const link = gql`
  scalar Date
  scalar AssetToken
  scalar URL

  enum Conclusion {
    truthy
    falsy
    uncertain
    disputed
  }

  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  #type Subscription {
  #  _: Boolean
  #}
`;

export default [
  link,
  directives,
  pagination,
  attachment,
  asset,
  topicSubmission,
];
