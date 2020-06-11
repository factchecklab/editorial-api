import dotenv from 'dotenv';
import { Client } from '@elastic/elasticsearch';

import topicSubmission from './topic-submission';

dotenv.config();

export const client = new Client({ node: process.env.ELASTICSEARCH_ENDPOINT });

const search = {
  TopicSubmission: topicSubmission,
};

export default search;
