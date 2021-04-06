module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
    jest: true,
  },
  globals: {
    __DEV__: false
  },
  plugins: [
    'prettier',
    '@typescript-eslint',
  ],
  extends: [
    'airbnb-base',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier/react',
    'prettier/standard',
  ],
  rules: {
    strict: 0,
    'no-nested-ternary': 0,
    'no-underscore-dangle': 0,
    'no-cond-assign': 0,
    'no-unused-expressions': 0,
    'no-param-reassign': ['error', {
      props: true,
      ignorePropertyModificationsFor: ['frame'],
    }],
    'no-restricted-syntax': ['error',
      'ForInStatement', 'LabeledStatement', 'WithStatement'
    ],
    'lines-between-class-members': ['error',
      'always', { exceptAfterSingleLine: true }
    ],
    'no-use-before-define': 0,
    '@typescript-eslint/no-use-before-define': ['error'],
    'import/extensions': 0,
    'import/no-unresolved': 0,
    'react/jsx-key': 0,
    'react/prop-types': 0,
    'react/display-name': 0,
    'react/no-unescaped-entities': ['error', {
      forbid: ['<', '>', '{', '}']
    }],
  },
  overrides: [
    {
      files: '**/__{tests,fixtures,mocks}__/*',
      rules: {
        'import/no-extraneous-dependencies': 0
      }
    }
  ],
  settings:{
    react: {
      pragma: 'Machinat',
    },
  }
};
