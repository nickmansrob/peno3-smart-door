FROM node:16.15-alpine AS builder

WORKDIR /usr/src/build
ARG package
COPY ./server/$package .
RUN ls -la
RUN pwd
RUN npm install
RUN npm run build
RUN ls -la

FROM node:16.15-alpine

WORKDIR /usr/src/app
ARG package
COPY --from=builder /usr/src/build/dist ./

EXPOSE 3000
CMD node --enable-source-maps index.js