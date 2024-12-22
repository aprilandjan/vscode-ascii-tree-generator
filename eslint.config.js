const typescriptEslint = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');

module.exports = {
  files: ['**/*.ts'],
  languageOptions: {
    parser: tsParser,
  },
  plugins: {
    '@typescript-eslint': typescriptEslint,
  },
  rules: {
    semi: [2, 'always'],
    '@typescript-eslint/no-unused-vars': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
  },
  ignores: [
    'node_modules',
    '.vscode-test',
    'out',
    'fixtures',
    '*.log',
    'azure-pipelines.yml',
    'yarn.lock',
  ],
};
