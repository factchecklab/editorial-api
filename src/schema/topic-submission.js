import gql from 'graphql-tag';

export default gql`
  extend type Mutation {
    submitTopic(input: SubmitTopicInput!): SubmitTopicPayload!
  }

  type SubmittedTopic {
    id: ID!
    content: String!
    source: String!
    url: String
    attachments: [Attachment!]!
    createdAt: Date!
    updatedAt: Date!
  }

  input SubmitTopicInput {
    content: String!
    source: String!
    url: String
    attachments: [AttachmentInput!]
    relatedReportId: ID @stub
  }

  type SubmitTopicPayload {
    submittedTopic: SubmittedTopic!
  }
`;
