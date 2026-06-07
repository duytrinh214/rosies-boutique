import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // Allow destructuring-to-omit (`const { id, ...rest } = row`) and
      // intentionally-ignored catch bindings (`catch (e) { /* ignore */ }`)
      'no-unused-vars': ['error', { ignoreRestSiblings: true, caughtErrors: 'none' }],
      // localStorage access is wrapped in try/catch and intentionally
      // swallows errors when storage is unavailable (e.g. private browsing)
      'no-empty': ['error', { allowEmptyCatch: true }],
    },
  },
])
