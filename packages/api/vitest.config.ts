import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Locks Vitest to this package directory — prevents it wandering up into packages/
    root: '.',

    // Node environment — not jsdom (which is for browser tests)
    environment: 'node',

    // 'forks' fixes the "Cannot find worker.js" bug caused by NodeNext in tsconfig.json
    pool: 'forks',

    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage',
      // Only measure YOUR source code — not test files or the server entry point
      include: ['src/**/*.ts'],
      exclude: ['src/tests/**', 'src/server.ts'],
      // ENFORCED THRESHOLDS: if any metric drops below 70%, the command exits
      // with a non-zero code, which fails the CI step and blocks the merge.
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 70,
        statements: 70,
      },
    },
  },
});
