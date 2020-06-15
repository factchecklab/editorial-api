import {
  makeExecutableSchema,
  makeRemoteExecutableSchema,
  mergeSchemas,
} from 'apollo-server';

import { HttpLink } from 'apollo-link-http';
import fetch from 'node-fetch';

import typeDefs from './schema';
import resolvers from './resolvers';
import factsApiSchema from './schema/facts-api';

export const makeSchema = async () => {
  const theSchema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const link = new HttpLink({
    uri:
      process.env.FACTS_API_ENDPOINT ||
      'https://api.factchecklab.org/graphql/facts',
    fetch,
  });

  const theFactsDBSchema = makeRemoteExecutableSchema({
    schema: await factsApiSchema(),
    link,
  });

  const mergedSchema = mergeSchemas({
    schemas: [theFactsDBSchema, theSchema],
  });
  return mergedSchema;
};
