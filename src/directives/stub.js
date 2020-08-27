// SPDX-FileCopyrightText: 2020 tech@factchecklab <tech@factchecklab.org>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { SchemaDirectiveVisitor } from 'graphql-tools';

export default class StubDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    field.isStub = true;
    return;
  }
  visitArgumentDefinition(arg) {
    arg.isStub = true;
    return;
  }
  visitInputFieldDefinition(arg) {
    arg.isStub = true;
    return;
  }
}
