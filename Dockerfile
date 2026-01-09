FROM oven/bun:latest as base

FROM base AS build
WORKDIR /app
COPY --link . .
RUN bun install
RUN bunx @tailwindcss/cli -i ./dev/tailwind.css -o ./apps/ruby/shared/public/static/dist/style.css
RUN bun build ./apps/ruby/__init__/App.tsx --outdir ./apps/ruby/shared/public/static/dist --target browser --entry-naming app.[ext] --asset-naming [name].[ext] --public-path /static/dist

FROM base as runtime
WORKDIR /app
RUN apt-get update && apt-get install -y curl
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps ./apps
COPY --from=build /app/migrations ./migrations
COPY --from=build /app/seeds ./seeds
COPY --from=build /app/tsconfig.json ./tsconfig.json
RUN mkdir -p /app/var/uploads
RUN mkdir -p /app/seeds/library/data/images/ready
EXPOSE 3000
CMD bun run ./apps/ruby/index.ts
