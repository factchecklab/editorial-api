import {
  generateAssetUrl,
  generateAssetToken,
  uploadAsset,
  uploadAssetFromUrl,
} from '../util/asset';

export default {
  Mutation: {
    createAsset: async (parent, { input }, { models, storage }) => {
      const { file } = input;
      let asset = await models.Asset.build(await uploadAsset(storage, file));
      asset = await asset.save({ returning: true });

      return {
        asset,
        token: generateAssetToken(asset.id),
      };
    },

    createAssetFromUrl: async (parent, { input }, { models, storage }) => {
      const { url } = input;
      let asset = await models.Asset.build(
        await uploadAssetFromUrl(storage, url)
      );
      asset = await asset.save({ returning: true });

      return {
        asset,
        token: generateAssetToken(asset.id),
      };
    },
  },

  Asset: {
    url: (asset, args, { storage }) => {
      return generateAssetUrl(storage, asset, {});
    },
    downloadUrl: (asset, args, { storage }) => {
      return generateAssetUrl(storage, asset, { promptSaveAs: asset.filename });
    },
  },
};
