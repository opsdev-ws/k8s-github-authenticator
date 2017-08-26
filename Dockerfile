FROM node:alpine

ENV NPM_CONFIG_LOGLEVEL warn

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install ts-node
RUN npm install -g typescript ts-node

# Install app dependencies
COPY node_modules /usr/src/app

# Bundle app source
COPY . /usr/src/app

EXPOSE 8900
CMD ["ts-node", "index.ts"]
