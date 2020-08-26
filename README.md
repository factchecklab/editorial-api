<!--
SPDX-FileCopyrightText: 2020 tech@factchecklab <tech@factchecklab.org>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

# Maat Response API Server

## Getting Started

1. Copy .env from .env.sample
2. Run yarn install
2. Run yarn migrate
3. Run yarn start

Or you can use `docker-compose up`. The API is available on port 4000.

To seed data, run `yarn seed:demo`, then `yarn reindex`.

## TODOs

The project is in active development. The current state of the project:

- [x] Prettier / Lint
- [ ] Tests
- [x] Build commands (babel emits js into dist directory)
- [ ] CI / CD
- [x] Database migration up/down
- [x] Simple queries schema and resolver, like query all and fetch by one
- [x] Simple graph traversal, like fetching topic responses
- [x] Query schema to support application use cases
- [x] Mutation schema to support application use cases
- [ ] Support published state, showing/hiding objects for all users
- [ ] Sorting by order field, to support which response appears first
- [ ] Assets / Attachments
- [ ] ElasticSearch connection
