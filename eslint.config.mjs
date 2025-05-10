import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import hooks from 'eslint-plugin-react-hooks';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config([
  {
    extends: [eslint.configs.recommended],
    files: ['./**/*.{ts,tsx}'],
  },
  {
    extends: [tseslint.configs.recommended],
    files: ['./**/*.{ts,tsx}'],
  },
  {
    extends: [react.configs.flat.recommended],
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off', // Disable prop-types as we're using TypeScript
    },
    settings: {
      react: {
        version: '18.2.0', // Specify React version
      },
    },
  },
  hooks.configs['recommended-latest'],
  prettierConfig,
]);
