import gql from 'graphql-tag';

export default gql`
  enum AttachmentItemType {
    response
    report
  }

  """
  Specify the attachment type.
  """
  enum AttachmentType {
    """
    The attachment is a URL to a remote resource.
    """
    url

    """
    The attachment is an asset.
    """
    asset
  }

  type Attachment {
    id: ID!
    type: AttachmentType!
    location: String
    asset: Asset
    createdAt: Date!
    updatedAt: Date!
  }

  """
  Input for specifying the content of an attachment.
  """
  input AttachmentInput {
    """
    The type of the attachment.
    """
    type: AttachmentType!

    """
    The location of the attachment if the type is an url.
    """
    location: URL

    """
    The asset token of the asset if the type is an asset.
    """
    assetToken: AssetToken
  }
`;
