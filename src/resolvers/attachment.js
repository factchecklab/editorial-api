export default {
  Attachment: {
    asset: (attachment, args, { models }) => {
      return attachment.getAsset();
    },
  },
};
