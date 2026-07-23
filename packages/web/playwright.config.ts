import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:5173',
    headless: true,
  },
 
  webServer: {
    command: 'npm run dev --workspace=packages/api',
    port: 3000,
    reuseExistingServer: true,
  },
});
