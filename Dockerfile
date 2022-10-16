FROM node:16.15-alpine AS builder

WORKDIR /usr/src/build
COPY . .
RUN npm install
ARG package
RUN npm run --prefix ./server/$package

FROM node:16:15-alpine
WORKDIR /usr/src/app
ARG package
COPY --from=builder /usr/src/build/$package/dist ./

EXPOSE 3000
CMD ["node", "index.js"]