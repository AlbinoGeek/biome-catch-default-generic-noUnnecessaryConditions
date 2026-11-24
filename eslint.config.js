// typescript-eslint needs the TypeScript 6 API, so it lives in eslint/ beside the TypeScript 7 root.
import { createRequire } from 'node:module'

const tseslint = createRequire(new URL('./eslint/', import.meta.url))('typescript-eslint')

export default [
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    plugins: { '@typescript-eslint': tseslint.plugin },
    rules: { '@typescript-eslint/no-unnecessary-condition': 'error' },
  },
]
