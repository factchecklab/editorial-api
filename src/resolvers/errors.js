// SPDX-FileCopyrightText: 2020 tech@factchecklab <tech@factchecklab.org>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { ApolloError } from 'apollo-server-koa';

export class NotFound extends ApolloError {
  constructor(message, props) {
    super(message, 'NOT_FOUND', props);
  }
}
