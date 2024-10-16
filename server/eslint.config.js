import prettier from 'eslint-plugin-prettier'
import eslintPluginSimpleImportSort from 'eslint-plugin-simple-import-sort'

const config = [
  { ignores: ['dist'] },
  {
    files: ['**/*.js'],
    plugins: {
      prettier,
      'simple-import-sort': eslintPluginSimpleImportSort
    },
    rules: {
      'simple-import-sort/imports': 'warn',
      'simple-import-sort/exports': 'warn',
      'prettier/prettier': ['warn', { usePrettierrc: true }]
    }
  }
]

export default config
