FROM oven/bun:latest AS base

FROM base AS build
WORKDIR /app
COPY --link . .
RUN bun install
RUN bunx @tailwindcss/cli -i ./dev/tailwind.css -o ./apps/ruby/shared/public/static/dist/style.css

FROM base AS runtime
WORKDIR /app
RUN apt-get update && apt-get install -y curl
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
