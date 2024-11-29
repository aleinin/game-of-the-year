module.exports = {
  env: {
    es6: true,
    browser: true,
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react/jsx-runtime',
  ],
  parser: '@typescript-eslint/parser',
  rules: {
    semi: ['error', 'never'],
    quotes: ['error', 'single'],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-expressions': [
      'error',
      { allowShortCircuit: true, allowTernary: true },
    ],
  },
  ignorePatterns: ['.eslintrc.cjs', 'build/'],
  settings: {
    react: {
      version: 'detect',
    },
  },
}
