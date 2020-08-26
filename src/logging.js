// SPDX-FileCopyrightText: 2020 tech@factchecklab <tech@factchecklab.org>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import dotenv from 'dotenv';
import winston from 'winston';
import Sentry from 'winston-transport-sentry-node';
import { RewriteFrames } from '@sentry/integrations';

dotenv.config();

const transports = [
  new winston.transports.Console({
    format:
      process.env.NODE_ENV == 'production'
        ? winston.format.json()
        : winston.format.combine(
            winston.format.colorize(),
            winston.format.printf((info) => {
              const preamble = `${info.timestamp} [${info.level}]`;
              let message = info.message;
              if (info.stack) {
                if (info.path) {
                  message += `\nPath: ${info.path.join('/')}`;
                }
                message += `\n${info.stack}`;
              }
              return `${preamble} ${message}`;
            })
          ),
  }),
];

if (process.env.SENTRY_DSN) {
  transports.push(
    new Sentry({
      sentry: {
        dsn: process.env.SENTRY_DSN,
        integrations: [
          // Used for rewriting SourceMaps
          new RewriteFrames({
            root: process.cwd(),
          }),
        ],
      },
      level: 'error',
    })
  );
}

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'warn',
  format: winston.format.combine(
    winston.format.splat(),
    winston.format.errors({ stack: true }),
    winston.format.timestamp()
  ),
  transports,
});
