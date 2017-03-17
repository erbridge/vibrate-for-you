FROM node

RUN apt-get update && apt-get install --assume-yes apt-transport-https
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | \
    apt-key add - && \
  echo "deb https://dl.yarnpkg.com/debian/ stable main" | \
    tee /etc/apt/sources.list.d/yarn.list

RUN apt-get update && apt-get install --assume-yes python-dev yarn

RUN git clone https://github.com/facebook/watchman.git /tmp/watchman
WORKDIR /tmp/watchman
RUN git checkout v4.7.0
RUN ./autogen.sh
RUN ./configure
RUN make
RUN make install

RUN yarn global add node-gyp

COPY package.json yarn.lock /tmp/
WORKDIR /tmp
RUN yarn install --pure-lockfile

WORKDIR /opt/app
COPY . /opt/app

RUN cp -a /tmp/node_modules /opt/app/

CMD ["yarn", "start"]
