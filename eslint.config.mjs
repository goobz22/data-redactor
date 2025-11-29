import js from '@eslint/js'

const eslintConfig = [
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'packages/core/dist/**',
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
      },
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-duplicate-imports': 'error',
      'linebreak-style': 'off',
      'eol-last': 'off',
    },
  },
]

export default eslintConfig
