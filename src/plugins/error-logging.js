// SPDX-FileCopyrightText: 2020 tech@factchecklab <tech@factchecklab.org>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import * as Sentry from '@sentry/node';
import { logger } from '../logging';

export const errorLoggingPlugin = {
  requestDidStart() {
    return {
      didEncounterErrors(rc) {
        Sentry.withScope((scope) => {
          scope.addEventProcessor((event) =>
            Sentry.Handlers.parseRequest(event, rc.request)
          );

          scope.setTags({
            graphqlName: rc.operationName || rc.request.operationName,
          });

          rc.errors.forEach((error) => {
            if (error.path) {
              scope.setExtras({
                path: error.path,
              });
            }

            if (
              (error.extensions && error.extensions.code) ||
              (!error.path && error.name === 'GraphQLError')
            ) {
              // This is a client error.
              const errorName =
                (error.extensions && error.extensions.code) ||
                error.name ||
                'Error';
              logger.warn(`${errorName}: ${error.message}`);
            } else {
              // This is an unexpected server error.
              logger.error(error);
            }
          });
        });
      },
    };
  },
};
