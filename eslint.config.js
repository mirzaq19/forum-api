const js = require('@eslint/js')
const globals = require('globals')
const { defineConfig } = require('eslint/config')

module.exports = defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: { js },
    extends: ['js/recommended']
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } }
  },
  {
    files: ['**/*.test.js'],
    languageOptions: { globals: { ...globals.jest, ...globals.node } }
  },
  {
    files: ['**/Domains/**/*.js', '**/Applications/**/*.js'],
    rules: {
      'no-unused-vars': 'off'
    }
  }
])
