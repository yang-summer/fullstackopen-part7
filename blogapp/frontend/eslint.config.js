import js from '@eslint/js';
import globals from 'globals';
import reactRecommended from 'eslint-plugin-react/configs/recommended.js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import vitestGlobals from 'eslint-plugin-vitest-globals';
import prettier from 'eslint-plugin-prettier/recommended';

export default [
  js.configs.recommended,
  reactRecommended,
  prettier, // 新增 Prettier 配置
  { ignores: ['dist', 'node_modules'] },
  {
    files: ['**/*.test.{js,jsx}'],
    plugins: {
      'vitest-globals': vitestGlobals,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...vitestGlobals.environments.env.globals,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      ...vitestGlobals.configs.recommended.rules,
      // 自定义规则
      'linebreak-style': ['error', 'unix'],
      quotes: ['error', 'single'],
      eqeqeq: 'error',
      'object-curly-spacing': ['error', 'always'],
      'arrow-spacing': ['error', { before: true, after: true }],
      'no-trailing-spaces': 'error',
      'no-console': 'off',
      'react/react-in-jsx-scope': 'off',
    },
  },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser, // 浏览器全局变量
        ...globals.es2020, // ES2020 特性支持
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    settings: {
      react: {
        version: 'detect', // 自动检测 React 版本
      },
    },
    rules: {
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      // 新增常用规则示例
      'react-hooks/exhaustive-deps': 'error', // 检查 useEffect 依赖
      // 自定义规则
      'linebreak-style': ['error', 'unix'],
      quotes: ['error', 'single'],
      eqeqeq: 'error',
      'object-curly-spacing': ['error', 'always'],
      'arrow-spacing': ['error', { before: true, after: true }],
      'no-trailing-spaces': 'error',
      'no-console': 'off',
      'react/react-in-jsx-scope': 'off',
    },
  },
];
