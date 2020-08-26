// SPDX-FileCopyrightText: 2020 tech@factchecklab <tech@factchecklab.org>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import models, { sequelize } from './models';
import search, { client as elastic } from './search';
import storage from './storage';
import { logger } from './logging';
import airtable from './airtable';

const context = () => {
  return {
    models,
    sequelize,
    elastic,
    search,
    storage,
    logger,
    airtable,
  };
};

export default context;
