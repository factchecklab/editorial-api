import gql from 'graphql-tag';

export default gql`
  type Attachment {
    id: ID!
    asset: Asset
    createdAt: Date!
    updatedAt: Date!
  }

  """
  Input for specifying the content of an attachment.
  """
  input AttachmentInput {
    """
    The asset token of the asset if the type is an asset.
    """
    assetToken: AssetToken
  }
`;
