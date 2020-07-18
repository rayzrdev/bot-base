#
# Run/build with alpine image that has only runtime support
#
# NOTE: If you need to install dependencies that require native compilation,
# consider using the Dockerfile-native example in this repo 
#
FROM node:12-alpine as runtime

WORKDIR /usr/src/app

COPY package.json .
COPY package-lock.json .
COPY src ./src
RUN npm ci --only=prod

CMD [ "npm", "start" ]

