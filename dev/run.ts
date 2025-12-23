import { logger } from '@razvan11/paladin';
import { concurrently } from 'concurrently';

const { result } = concurrently([
  {
    command: 'docker stop $(docker ps -a -q) || true && docker rm $(docker ps -a -q) || true && docker compose -f ./dev/docker-compose.yml up -d',
    name: 'docker',
  },
  {
    command:
      'bunx @tailwindcss/cli -i ./dev/tailwind.css -o ./apps/ruby/shared/public/static/dist/style.css --watch',
    name: 'tailwind',
  },
  {
    command:
      'bun build ./apps/ruby/__init__/App.tsx --outdir ./apps/ruby/shared/public/static/dist --target browser --entry-naming app.[ext] --asset-naming [hash].[ext] --watch',
    name: 'ruby:platform',
  },
  {
    command: 'bun run --watch ./apps/ruby/index.ts',
    name: 'paladin:app',
  },
]);

result.catch((error) => {
  logger.error(error);
});
