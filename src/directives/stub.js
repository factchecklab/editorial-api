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
