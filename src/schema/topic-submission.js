import gql from 'graphql-tag';

export default gql`
  extend type Mutation {
    """
    Submit a fake news topic to editorial team.
    """
    submitTopic(input: SubmitTopicInput!): SubmitTopicPayload!
  }

  """
  A submitted topic represents information that a member of the general public
  suggests that such information should be fact checked.
  """
  type SubmittedTopic {
    """
    ID of the submitted topic.
    """
    id: ID!

    """
    Original message of the information.
    """
    message: String

    """
    URL where the original message or fake news is made available.
    """
    url: String

    """
    Personal comment from the person who submitted the topic.
    """
    comment: String

    """
    Attachments for this submitted topic.
    """
    attachments: [Attachment!]!

    """
    The time when this topic is created.
    """
    createdAt: Date!

    """
    This submission is a duplicate of a previous submission.
    """
    isDuplicate: Boolean!
  }

  """
  Input for submit topic.
  """
  input SubmitTopicInput {
    """
    Original message to be fact checked.
    """
    message: String

    """
    URL where the original message or fake news is made available.
    """
    url: String

    """
    Personal comment from the person who submitted the topic.
    """
    comment: String

    """
    Attachments for this submitted topic.
    """
    attachments: [AttachmentInput!]
  }

  """
  Result of the submit topic request.
  """
  type SubmitTopicPayload {
    """
    The submitted topic.
    """
    submittedTopic: SubmittedTopic!
  }
`;
