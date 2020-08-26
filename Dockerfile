# SPDX-FileCopyrightText: 2020 tech@factchecklab <tech@factchecklab.org>
#
# SPDX-License-Identifier: AGPL-3.0-or-later

FROM node:12-slim

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .

ENV HOST=0.0.0.0 PORT=4000
EXPOSE 4000
CMD [ "yarn", "dev" ]
