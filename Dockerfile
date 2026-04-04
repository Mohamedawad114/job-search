FROM node:22-alpine3.19 AS base

RUN apk add --no-cache tini
WORKDIR /app
COPY package*.json ./

FROM base AS dev
ENV NODE_ENV=development
RUN npm i
COPY . .
RUN npx prisma generate
EXPOSE 3000


ENTRYPOINT ["/sbin/tini", "--"]
CMD ["npm", "run", "start:dev"]


FROM base AS builder

ENV NODE_ENV=development
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build


FROM base AS prod

ENV NODE_ENV=production \
    PORT=3000
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma 

RUN npm ci --omit=dev
RUN npx prisma generate
COPY --from=builder /app/dist ./dist
RUN addgroup -S appgroup && adduser -S appuser -G appgroup && \
    chown -R appuser:appgroup /app

USER appuser

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD wget -qO- http://localhost:3000/api/health || exit 1

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]