module.exports = {
  plugins: ['@typescript-eslint'],
  parser: '@typescript-eslint/parser',
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'airbnb',
    'airbnb/hooks',
    'plugin:valtio/recommended',
    'prettier',
  ],
  rules: {
    // I suggest you add at least those two rules:
    // "@typescript-eslint/no-unused-vars": "error",
    // "@typescript-eslint/no-explicit-any": "error"
    'no-unused-vars': 'off',
    'no-use-before-define': 'off',
    'valtio/state-snapshot-rule': 'warn',
    'valtio/avoid-this-in-proxy': 'warn',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-filename-extension': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/function-component-definition': 'off',
    'no-lone-blocks': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    'consistent-return': 'off',
    'arrow-body-style': 'off',
  },
}
