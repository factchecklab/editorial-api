import path from 'path';

import { loadSchema } from '@graphql-tools/load';
import { JsonFileLoader } from '@graphql-tools/json-file-loader';
import {
  FilterRootFields,
  FilterObjectFields,
  FilterTypes,
  wrapSchema,
} from '@graphql-tools/wrap';

export const load = () => {
  var filepath = path.join(__dirname, 'schema.json');

  return loadSchema(filepath, {
    loaders: [new JsonFileLoader()],
  });
};

export const wrap = (schema) => {
  return wrapSchema(schema, [
    new FilterRootFields((operation, fieldName, fieldConfig) => {
      return operation == 'Query' && fieldName == 'searchRelatedReports';
    }),
    new FilterTypes((type, options) => {
      return [
        // Root types
        'Query',

        // Scalars
        'String',
        'URL',
        'Float',
        'ID',
        'Int',
        'Boolean',
        'Date',

        // Page info
        'PageInfo',
        'Cursor',

        // Report and publisher
        'Report',
        'SearchRelatedReportConnection',
        'SearchRelatedReportEdge',
        'Conclusion',
        'Publisher',

        // Others
        'CacheControlScope',
      ].includes(type.name);
    }),
    new FilterObjectFields((typeName, fieldName, fieldConfig) => {
      switch (typeName) {
        case 'Publisher':
          return ['name', 'url'].includes(fieldName);
        case 'Report':
          return [
            'summary',
            'conclusion',
            'explanation',
            'author',
            'publisher',
            'fullReportUrl',
            'publishedAt',
          ].includes(fieldName);
        default:
          return true;
      }
    }),
  ]);
};

const loadAndWrap = async () => {
  return wrap(await load());
};

export default loadAndWrap;
