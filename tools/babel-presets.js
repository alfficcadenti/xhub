const {browsers} = require('./webpack/lists');
const debug = require('debug')('catalyst-app:babel-presets');

const isProd = process.env.NODE_ENV === 'production';
const cdnUrl = process.env.CDN_URL;
let prefix = '/';
if (isProd && cdnUrl) {
    const {version} = require('../config/buildInfo');
    prefix = `${cdnUrl}/opxhub-ui/${version}/assets/`;
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
                    corejs: '3',
                    targets: {browsers}
                }
            ]
        ],
        plugins: ['@babel/plugin-syntax-dynamic-import',
        ["@babel/plugin-proposal-class-properties", { "loose": true }],
        ["@babel/plugin-proposal-private-methods", { "loose": true }],
        ["@babel/plugin-proposal-private-property-in-object", { "loose": true }]]
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
                    corejs: '3',
                    targets: {browsers}
                }
            ]
        ],
        plugins: ['react-hot-loader/babel', '@babel/plugin-syntax-dynamic-import',
        ["@babel/plugin-proposal-class-properties", { "loose": true }],
        ["@babel/plugin-proposal-private-methods", { "loose": true }],
        ["@babel/plugin-proposal-private-property-in-object", { "loose": true }]]
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
            ],
            ["@babel/plugin-proposal-class-properties", { "loose": true }],
            ["@babel/plugin-proposal-private-methods", { "loose": true }],
            ["@babel/plugin-proposal-private-property-in-object", { "loose": true }]
        ]
    }
};

module.exports = (api) => {
    const env = api.env();
    debug('Getting babelrc for env="%s".', env);
    if (env === "browsertest") {
        return {presets: ["es2015"]}
    }
    return environments[env];
};
