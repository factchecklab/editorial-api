import gql from 'graphql-tag';

export default gql`
  extend type Query {
    """
    Search for report that are related to the specified info.
    """
    searchRelatedReports(
      """
      The content to search
      """
      content: String

      """
      The url to search
      """
      url: String @stub
    ): SearchRelatedReportConnection!
  }

  extend type Mutation {
    submitTopic(input: SubmitTopicInput!): SubmitTopicPayload!
  }

  type SearchRelatedReportConnection {
    edges: [SearchRelatedReportEdge!]
    nodes: [Report!]
  }

  type SearchRelatedReportEdge {
    node: Report!
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
