const babelParser = require('@babel/eslint-parser')
const js = require('@eslint/js')
const prettier = require('eslint-plugin-prettier')
const eslintPluginSimpleImportSort = require('eslint-plugin-simple-import-sort')
const globals = require('globals')

module.exports = [
  { ignores: ['dist', 'node_modules'] },
  {
    files: ['**/*.js'],
    plugins: {
      prettier,
      'simple-import-sort': eslintPluginSimpleImportSort
    },
    rules: {
      ...js.configs.recommended.rules,
      'simple-import-sort/imports': 'warn',
      'simple-import-sort/exports': 'warn',
      'prettier/prettier': ['warn', { usePrettierrc: true }]
    },
    languageOptions: {
      sourceType: 'module',
      ecmaVersion: 'latest',
      parser: babelParser,
      globals: globals.node
    }
  }
]
