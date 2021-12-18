module.exports = {
    env: {
        browser: true,
        es2021: true
    },

    extends: [
        'plugin:react/recommended',
        'standard'
    ],
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        },
        ecmaVersion: 11,
        sourceType: 'module',
        allowImportExportEverywhere: true
    },
    plugins: [
        'react'
    ],
    rules: {
        'react/prop-types': 0,
        semi: ['error', 'always'],
        'prefer-const': 0,
        // 保存代码时缩进4个空格
        indent: ['error', 4],
        'global-require': 0
    }
};
