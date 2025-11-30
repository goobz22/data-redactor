import js from '@eslint/js'

const eslintConfig = [
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'packages/core/dist/**',
      'packages/core/src/**/*.ts',
      'packages/api/**/*.ts',
    ],
  },
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        // Browser globals
        document: 'readonly',
        window: 'readonly',
        navigator: 'readonly',
        console: 'readonly',
        alert: 'readonly',
        FileReader: 'readonly',
        Blob: 'readonly',
        URL: 'readonly',
        Event: 'readonly',
        localStorage: 'readonly',
        setTimeout: 'readonly',
        confirm: 'readonly',
        fetch: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-duplicate-imports': 'error',
      'linebreak-style': 'off',
      'eol-last': 'off',
    },
  },
  // Bun-specific files
  {
    files: ['build-ui.js', 'packages/api/**/*.ts'],
    languageOptions: {
      globals: {
        process: 'readonly',
        Bun: 'readonly',
      },
    },
  },
  // Tampermonkey userscript
  {
    files: ['examples/tampermonkey-redactor.js'],
    languageOptions: {
      globals: {
        GM_addStyle: 'readonly',
        GM_getValue: 'readonly',
        GM_setValue: 'readonly',
      },
    },
  },
]

export default eslintConfig
