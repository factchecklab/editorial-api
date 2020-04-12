import gql from 'graphql-tag';

import directives from './directives';
import pagination from './pagination';
import entity from './entity';
import topic from './topic';
import response from './response';
import attachment from './attachment';
import asset from './asset';
import message from './message';
import report from './report';
import socialPlatform from './social-platform';
import socialGroup from './social-group';
import socialPoster from './social-poster';
import socialPost from './social-post';

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
  topic,
  response,
  attachment,
  asset,
  message,
  report,
  socialPlatform,
  socialGroup,
  socialPoster,
  socialPost,
];
