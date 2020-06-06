import gql from 'graphql-tag';

export default gql`
  extend type Mutation {
    createResponse(input: CreateResponseInput!): CreateResponsePayload!
    updateResponse(input: UpdateResponseInput!): UpdateResponsePayload!
    deleteResponse(input: DeleteResponseInput!): DeleteResponsePayload!
  }

  enum ResponseType {
    review
    response
  }

  type Response {
    id: ID!
    content: String!
    type: ResponseType!
    published: Boolean!
    conclusion: Conclusion!
    entity: Entity!
    # topic: Topic!
    attachments: [Attachment!]
    createdAt: Date!
    updatedAt: Date!
  }

  input CreateResponseInput {
    topicId: ID!
    content: String
    type: ResponseType
    published: Boolean
    conclusion: Conclusion
    entityId: ID!
  }

  type CreateResponsePayload {
    response: Response!
  }

  input UpdateResponseInput {
    id: ID!
    content: String
    type: ResponseType
    published: Boolean
    conclusion: Conclusion
  }

  type UpdateResponsePayload {
    response: Response!
  }

  input DeleteResponseInput {
    id: ID!
  }

  type DeleteResponsePayload {
    responseId: ID!
  }
`;
