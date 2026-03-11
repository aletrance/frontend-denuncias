# ---- Stage 1: Build ----
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src/ ./src/

RUN npx tsc

# ---- Stage 2: Production ----
FROM node:20-alpine

WORKDIR /app

# Install su-exec for dropping privileges and create non-root user
RUN apk add --no-cache su-exec \
    && addgroup -S appgroup \
    && adduser -S appuser -G appgroup

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY views/ ./views/
COPY public/ ./public/

# Create uploads directory
RUN mkdir -p /app/uploads && chown -R appuser:appgroup /app/uploads

# Copy entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

# Run as root initially so entrypoint can fix volume permissions,
# then it drops to appuser via su-exec
ENTRYPOINT ["/entrypoint.sh"]
