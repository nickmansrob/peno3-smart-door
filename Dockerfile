FROM node:16.15-alpine AS builder

WORKDIR /usr/src/build
ARG package
COPY ./server/$package .
RUN ls -la
RUN pwd
RUN npm install
RUN npm run build

FROM node:16.15-alpine

WORKDIR /usr/src/app
ARG package
COPY --from=builder /usr/src/build/$package/dist ./

EXPOSE 3000
CMD node --enable-source-maps index.js