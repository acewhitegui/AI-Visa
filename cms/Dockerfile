# Creating multi-stage build for production
FROM node:22-slim as build
ENV NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /opt/
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install --production
ENV PATH=/opt/node_modules/.bin:$PATH
WORKDIR /opt/app
COPY . .
RUN pnpm run build

# Creating final production image
FROM node:22-slim
ENV NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# install curl
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
HEALTHCHECK --interval=30s --timeout=5s --retries=5 --start-period=10s CMD curl -fs http://localhost:1338/_health || exit 1

WORKDIR /opt/
COPY --from=build /opt/node_modules ./node_modules

WORKDIR /opt/app
COPY --from=build /opt/app ./
ENV PATH=/opt/node_modules/.bin:$PATH

RUN npm install -g pnpm
RUN chown -R node:node /opt/app
USER node
EXPOSE 1338
CMD ["pnpm", "start"]