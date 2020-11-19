module.exports = {
  extends: ['airbnb-base', 'plugin:vue/recommended'],
  rules: {
    'max-len': 80,
    'arrow-parens': 'always',
    'no-param-reassign': [
      'error',
      {
        props: true,
        ignorePropertyModificationsFor: [
          'state',
          'acc',
          'e',
          'ctx',
          'req',
          'request',
          'res',
          'response',
          '$scope',
        ],
      },
    ],
  },
};
