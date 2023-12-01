/** @type {import("eslint").Linter.Config} */
const config = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: ['standard-with-typescript', 'prettier'],
    overrides: [
        {
            env: {
                node: true,
            },
            files: ['.eslintrc.{js,cjs}'],
            parserOptions: {
                sourceType: 'script',
            },
        },
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/consistent-type-definitions': 'off',
    },
    ignorePatterns: ['.eslintrc.cjs', 'jest.config.js', 'prettier.config.mjs'],
};

module.exports = config;
