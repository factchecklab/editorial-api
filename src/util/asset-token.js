import jwt from 'jsonwebtoken';

const jwtOptions = { algorithm: 'HS256' };

const getTokenSecret = () => {
  const secret =
    process.env.APPLICATION_SECRET ||
    (process.env.NODE_ENV === 'development' && 'secret');
  if (!secret) {
    throw new Error(
      'Unable to verify asset token because of a configuration error.'
    );
  }
  return secret;
};

export class AssetTokenError extends Error {
  constructor(message) {
    super(message || 'Incorrect asset token or not specified.');
  }
}

export const generate = (assetId) => {
  return new Promise((resolve, reject) => {
    if (!assetId) {
      reject(new Error('assetId not specified'));
    }

    jwt.sign(
      { assetId: parseInt(assetId) },
      getTokenSecret(),
      jwtOptions,
      (err, token) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(token);
      }
    );
  });
};

export const verify = (token, expectedAssetId) => {
  return new Promise((resolve, reject) => {
    if (!token) {
      throw new AssetTokenError();
    }

    jwt.verify(token, getTokenSecret(), jwtOptions, (err, payload) => {
      if (err) {
        reject(err);
        return;
      }

      if (expectedAssetId && parseInt(expectedAssetId) !== payload.assetId) {
        reject(new AssetTokenError());
        return;
      }

      if (!payload.assetId) {
        reject(new AssetTokenError());
      }

      resolve(payload.assetId);
    });
  });
};
