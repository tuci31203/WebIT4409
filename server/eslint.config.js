import babelParser from '@babel/eslint-parser'
import js from '@eslint/js'
import prettier from 'eslint-plugin-prettier'
import eslintPluginSimpleImportSort from 'eslint-plugin-simple-import-sort'
import globals from 'globals'

const config = [
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

export default config
