module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      plugins: ['@typescript-eslint'],
    },
  ],
  rules: {},
}
