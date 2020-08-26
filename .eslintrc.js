// SPDX-FileCopyrightText: 2020 tech@factchecklab <tech@factchecklab.org>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true
  },
  parser: 'babel-eslint',
  parserOptions: {
  },
  extends: [
    'prettier',
    'plugin:prettier/recommended',
    'eslint:recommended'
  ],
  plugins: [
    'prettier'
  ],
  // add your custom rules here
  rules: {
    'camelcase': 'error',
    'no-return-await': 'error',
    'require-await': 'error',
    'no-unused-vars': ['error', { "args": "none" }]
  }
}
