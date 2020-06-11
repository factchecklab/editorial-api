import gql from 'graphql-tag';

export default gql`
  extend type Mutation {
    """
    Create an asset by uploading a file.
    """
    createAsset(input: CreateAssetInput!): CreateAssetPayload!

    """
    Create an asset by fetching from a URL.
    """
    createAssetFromUrl(input: CreateAssetFromUrlInput!): CreateAssetPayload!
  }

  """
  Asset contains information of a file.
  """
  type Asset {
    """
    The ID of the asset.
    """
    id: ID!

    """
    The content type of the asset file.
    """
    contentType: String!

    """
    The filename of the file.
    """
    filename: String!

    """
    Get the URL for viewing the asset.
    """
    url: URL!

    """
    Get the download URL for the asset.
    """
    downloadUrl: URL!
  }

  """
  Input for create asset.
  """
  input CreateAssetInput {
    """
    The file upload object to create asset from.
    """
    file: Upload!
  }

  """
  Input for create asset from URL.
  """
  input CreateAssetFromUrlInput {
    """
    The URL to create asset from.
    """
    url: URL!
  }

  """
  UploadedAsset contains information about an uploaded file.
  """
  type CreateAssetPayload {
    """
    The created asset
    """
    asset: Asset!

    """
    The asset token is opaque data returned to the upload as a proof that
    it is uploaded by the same user.
    """
    token: AssetToken!
  }
`;
