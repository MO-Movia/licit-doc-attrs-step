const config = require('@modusoperandi/eslint-config');
module.exports = [
  ...config.getFlatConfig({
    strict: false,
  }),
  {
    rules: {
      //Include any rule overrides here!
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
];
