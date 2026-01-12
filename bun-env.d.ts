declare module 'bun' {
  interface Env {
    APP_POSTHOG_KEY: string;
    APP_POSTHOG_HOST: string;
    APP_URL: string;
  }
}
