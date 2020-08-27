// SPDX-FileCopyrightText: 2020 tech@factchecklab <tech@factchecklab.org>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { v4 as uuidv4 } from 'uuid';

export const generateId = () => {
  const encodeMap = {
    '+': '-',
    '/': '_',
    '=': '',
  };
  const buf = Buffer.alloc(16);
  uuidv4(null, buf);
  return buf.toString('base64').replace(/[+/=]/g, (m) => encodeMap[m]);
};
