const Path = require('path');
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const autoprefixer = require('autoprefixer');
const {vendors, browsers} = require('./lists');
const webpack = require('webpack');
const path = require('path');

const SRC_DIR = Path.join(__dirname, 'src', 'universal');

const isProd = process.env.NODE_ENV === 'production';
const cdnUrl = process.env.CDN_URL;
let imagesPublicPath = '/';
if (isProd && cdnUrl) {
    const {version} = require('../../config/buildInfo');
    imagesPublicPath = `${cdnUrl}/opxhub-ui/${version}/assets/`;
}

// -- Common configuration -------------------------------------------

module.exports = {
    resolve: {
        extensions: ['.js', '.css', '.less', '.gif', '.jpg', '.jpeg', '.png', '.svg', '.ico'],
        modules: ['node_modules', SRC_DIR],
        alias: {
            'edap-integrations': path.join('@homeaway', 'edap-integrations', 'release', 'javascripts', 'edap-integrations.webpack.js')
        }
    },

    module: {
        rules: [
            {
                test: /\.js(x)?$/,
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true
                },
                include: /src|tests|docs/
            },
            {
                test: /\.less$/,
                use: [
                    ExtractCssChunks.loader,
                    {loader: 'css-loader', options: {importLoaders: 2, modules: {localIdentName: '[local]'}}},
                    {loader: 'postcss-loader', options: {plugins: [autoprefixer(browsers)]}},
                    'less-loader'
                ]
            },
            {
                test: /\.css$/,
                use: [
                    ExtractCssChunks.loader,
                    {loader: 'css-loader', options: {importLoaders: 1, modules: {localIdentName: '[local]'}}},
                    {loader: 'postcss-loader', options: {plugins: [autoprefixer(browsers)]}}
                ]
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg|ico)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: isProd ? '[name].[hash:12].[ext]' : '[name].[ext]',
                            publicPath: imagesPublicPath,
                            outputPath: ''
                        }
                    }
                ]
            }
        ]
    },

    optimization: {
        usedExports: true,
        splitChunks: {
            cacheGroups: {
                vendor: {
                    name: 'vendor',
                    test: new RegExp(vendors.join(`${Path.sep}|${Path.sep}`)),
                    chunks: 'all'
                }
            }
        }
    },

    plugins: [
        new ExtractCssChunks({filename: isProd ? '[name].[hash:12].css' : '[name].css', modules: true, hot: true}),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ],

    stats: {
        children: false
    }
};
