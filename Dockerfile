
FROM node:10.15.3-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY ./src ./src
COPY .env ./
COPY .babelrc ./

EXPOSE 3030 3030