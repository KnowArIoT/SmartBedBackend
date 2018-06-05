module.exports = {
  parser: 'babel-eslint',
  extends: ['airbnb-base', 'prettier'],
  env: {
    browser: false,
  },
  rules: {
    'no-constant-condition': [2, { checkLoops: false }],
    'import/no-named-as-default': 0,
    'import/prefer-default-export': 0,
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
  },
};
