// SPDX-FileCopyrightText: 2020 tech@factchecklab <tech@factchecklab.org>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { parse as pgParse } from 'pg-connection-string';

/**
 * Return an object containing database connection parameters. The object
 * can be passed to Sequelize to create a database connection.
 *
 * Here are two kinds of connection string supported by pg-connection-string:
 * 1. socket://user:pass@/var/run/pgsql
 * 2. postgres://<user>:<password>@<host>:<port>/<database>?<query>
 */
export const parse = (connectionString) => {
  const { user, ...props } = pgParse(connectionString);
  return {
    username: user,
    ...props,
  };
};
