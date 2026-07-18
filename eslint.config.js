import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      // Error on unused variables unless they start with _ (convention for intentionally unused)
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      // Warn on explicit any — encourages proper typing
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  {
    // Never lint generated or vendored code
    ignores: ['**/dist/**', '**/node_modules/**', '**/coverage/**'],
  },
];