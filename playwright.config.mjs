import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './test',
  testMatch: '**/*.spec.mjs',
  webServer: {
    command: 'npm run preview',
    url: 'http://localhost:4321/parley/',
    reuseExistingServer: false,
    timeout: 60_000,
  },
  use: { baseURL: 'http://localhost:4321/parley/' },
});
