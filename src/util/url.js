// SPDX-FileCopyrightText: 2020 tech@factchecklab <tech@factchecklab.org>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import neatUrl from 'neat-url';
import normalizeUrl from 'normalize-url';

/**
 * Returns a URL that is normalized and with tracking parameters removed.
 */
export const cleanUrl = (url) => {
  // NOTE(cheungpat): This function does not return a Promise. If changing
  // the function to return a Promise instead, change all the code that calls
  // this function.
  return neatUrl({
    url: normalizeUrl(url, {
      stripWWW: false,
      removeQueryParameters: [],
      removeTrailingSlash: false,
    }),
    includeHash: true,
  });
};
