// SPDX-FileCopyrightText: 2020 tech@factchecklab <tech@factchecklab.org>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

export default {
  Attachment: {
    asset: (attachment, args, { models }) => {
      return attachment.getAsset();
    },
  },
};
