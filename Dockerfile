FROM node:16.15-alpine AS builder

WORKDIR /usr/src/build
ARG package
COPY ./server/$package .

RUN npm install
RUN npm run build

FROM node:16.15-alpine

WORKDIR /usr/src/app
ARG package
COPY --from=builder /usr/src/build ./

COPY start-server /usr/bin/

EXPOSE 3000 5555
CMD start-server $package
