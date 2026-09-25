import js from '@eslint/js';
import playwright from 'eslint-plugin-playwright';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';

export default [
  { ignores: ['node_modules/**', 'playwright-report/**', 'test-results/**', 'playwright/.auth/**'] },
  js.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      playwright,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...playwright.configs['flat/recommended'].rules,
      // TypeScript itself resolves globals and unknown identifiers
      'no-undef': 'off',
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/explicit-member-accessibility': 'error',
      '@typescript-eslint/typedef': ['error', { variableDeclaration: true, memberVariableDeclaration: true }],
      'playwright/expect-expect': 'off',
    },
  },
];
