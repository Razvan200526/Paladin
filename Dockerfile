FROM oven/bun:latest AS base

FROM base AS build
WORKDIR /app
COPY --link . .
RUN bun install
RUN bunx @tailwindcss/cli -i ./dev/tailwind.css -o ./apps/ruby/shared/public/static/dist/style.css

FROM base AS runtime
WORKDIR /app

# Install curl for health checks
RUN apt-get update && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

# Copy application files
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps ./apps
COPY --from=build /app/scripts ./scripts
COPY --from=build /app/migrations ./migrations
COPY --from=build /app/seeds ./seeds
COPY --from=build /app/tsconfig.json ./tsconfig.json
COPY --from=build /app/bunfig.toml ./bunfig.toml
COPY --from=build /app/dev ./dev

EXPOSE 3000

# Health check (runs after app is started by Railway)
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

# No CMD - Railway runs `bun run prod` after build (env vars not available at build time)
