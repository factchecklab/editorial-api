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

  type SearchRelatedReportConnection {
    edges: [SearchRelatedReportEdge!]
    nodes: [Report!]
  }

  type SearchRelatedReportEdge {
    node: Report!
  }

  type Report {
    id: ID!
    title: String!
    summary: String
    published: Boolean!
    conclusion: Conclusion!

    """
    Cover image for the report.
    """
    coverImage: Asset
    createdAt: Date!
    updatedAt: Date!
  }
`;
