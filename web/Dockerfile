# Creating multi-stage build for production
FROM node:22-slim as prepare

WORKDIR /opt/
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install

FROM node:22-slim as build

ARG STRAPI_API_TOKEN
ENV STRAPI_API_TOKEN=${STRAPI_API_TOKEN}

ARG NEXT_PUBLIC_STRAPI_API_URL
ENV NEXT_PUBLIC_STRAPI_API_URL=${NEXT_PUBLIC_STRAPI_API_URL}

ARG STRAPI_API_URL
ENV STRAPI_API_URL=${STRAPI_API_URL}

ENV NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /opt/
COPY --from=prepare /opt/node_modules ./node_modules
ENV PATH=/opt/node_modules/.bin:$PATH
COPY . .

RUN npm install -g pnpm
RUN pnpm run build

# Creating final production image
FROM node:22-slim
RUN npm install -g pnpm

# install curl
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
HEALTHCHECK --interval=30s --timeout=5s --retries=5 --start-period=10s CMD curl -fs http://localhost:3002/api/health || exit 1

ARG STRAPI_API_TOKEN
ENV STRAPI_API_TOKEN=${STRAPI_API_TOKEN}

ARG NEXT_PUBLIC_STRAPI_API_URL
ENV NEXT_PUBLIC_STRAPI_API_URL=${NEXT_PUBLIC_STRAPI_API_URL}

ENV NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /opt/

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=build /opt/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=build --chown=nextjs:nodejs /opt/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /opt/.next/static ./.next/static

USER nextjs

EXPOSE 3002

CMD ["node", "server.js"]