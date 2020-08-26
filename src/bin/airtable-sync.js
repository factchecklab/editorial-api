// SPDX-FileCopyrightText: 2020 tech@factchecklab <tech@factchecklab.org>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import context from '../context';
import yargs from 'yargs';
import initTopicSubmissionHook from '../models/hooks/topic-submission';
import { fetchAndUpdate, saveNew } from '../airtable/topic-submission';

const argv = yargs.argv;

const fetch = async (ctx) => {
  const { logger, airtable } = ctx;
  logger.info('Running airtable fetch topic-submission job');
  const syncSince = argv.since ? new Date(argv.since) : null;
  if (syncSince) {
    logger.info(
      `Most recent updated date is ${syncSince.toISOString()}. Will query airtable for records later than this date.`
    );
  } else {
    logger.info(
      `Unable to find most recent updated date in records table. Will query airtable for all records.`
    );
  }
  await fetchAndUpdate(airtable, syncSince, ctx);
  await saveNew(airtable, ctx);
};

(async function main() {
  const ctx = context();
  initTopicSubmissionHook(ctx.models, ctx, { disableAirtable: true });
  await fetch(ctx);
  console.log('Done');
})();
