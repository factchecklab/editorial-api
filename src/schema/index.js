import gql from 'graphql-tag';

import directives from './directives';
import pagination from './pagination';
import attachment from './attachment';
import asset from './asset';
import topicSubmission from './topic-submission';
import upload from './upload';

const link = gql`
  scalar Date
  scalar AssetToken
  scalar URL

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
  upload,
];
