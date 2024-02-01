FROM cgr.dev/chainguard/node-lts:latest-dev@sha256:ecd794ef80b4d53e2f728d01852279d8cc0c6d28437a8259146898e8f6e8ef60 as build

COPY package.json .
RUN npm install

COPY . .
RUN mkdir /app/dist /app/logs
RUN npm run build

FROM cgr.dev/chainguard/node-lts:latest@sha256:54302e38b6f6a09f81cd65c93c0c16d8520d1de9b1c941932cfb689e2c3e7175
USER node
COPY --from=build /app/dist/index.js /app/index.js

CMD ["index.js"]