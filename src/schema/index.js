import gql from 'graphql-tag';

import directives from './directives';
import pagination from './pagination';
import entity from './entity';
import report from './report';
import response from './response';
import attachment from './attachment';
import asset from './asset';
import message from './message';
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
  entity,
  report,
  response,
  attachment,
  asset,
  message,
  topicSubmission,
];
