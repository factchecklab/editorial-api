// SPDX-FileCopyrightText: 2020 tech@factchecklab <tech@factchecklab.org>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

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
