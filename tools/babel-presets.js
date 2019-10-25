const { browsers } = require('./webpack/lists');
const debug = require('debug')('catalyst-app:babel-presets');

const isProd = process.env.NODE_ENV === 'production';
const cdnUrl = process.env.CDN_URL
let prefix = '/';
if (isProd && cdnUrl) {
  const {version} = require('../config/buildInfo')
  prefix = `${cdnUrl}/opxhub/${version}/assets/`;
}

const environments = {
  client: {
    presets: [
      '@babel/preset-react',
      [
        '@babel/preset-env',
        {
          modules: false,
          loose: true,
          useBuiltIns: 'entry',
          targets: { browsers }
        }
      ]
    ],
    plugins: ['@babel/plugin-syntax-dynamic-import']
  },

  'client-dev': {
    presets: [
      '@babel/preset-react',
      [
        '@babel/preset-env',
        {
          modules: false,
          loose: true,
          useBuiltIns: 'entry',
          targets: { browsers }
        }
      ]
    ],
    plugins: ['react-hot-loader/babel', '@babel/plugin-syntax-dynamic-import']
  },

  test: {
    presets: [
      '@babel/preset-env',
      '@babel/preset-react'
    ]
  },

  server: {
    presets: [
      '@babel/preset-react',
      [
        '@babel/preset-env',
        {
          targets: {
            node: 'current'
          }
        }
      ]
    ],
    plugins: [
      'babel-plugin-dynamic-import-node',
      [
        'css-modules-transform',
        {
          generateScopedName: '[local]',
          extensions: ['.css', '.scss', '.less']
        }
      ],
      [
        'transform-assets',
        {
          name: isProd ? `${prefix}[name].[hash:12].[ext]` : '/[name].[ext]',
          extensions: ['png', 'ico']
        }
      ]
    ]
  }
};

module.exports = api => {
  const env = api.env();
  debug('Getting babelrc for env="%s".', env);
  return environments[env];
};
