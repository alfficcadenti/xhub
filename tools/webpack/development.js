const webpack = require('webpack');
const merge = require('webpack-merge');
const commonConfig = require('./common');

// -- Development options----------------------------------------------
//
// During development, webpack is used in "hot module replacement" mode.
// The code in the src/universal directory is packaged and served to
// the browser. When the code in that directory is changed, it will be
// repackaged and the browser will auto-rerender the changed module.
//
module.exports = merge(commonConfig, {

    mode: 'development',

    entry: {
        bundle: [
            './src/universal/entry.js'
        ]
    },

    output: {
        path: __dirname,
        filename: '[name].js',
        publicPath: '/'
    },

    optimization: {
        runtimeChunk: 'single'
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],

    devServer: {
        host: '0.0.0.0',

        port: 8080,

        // See readme for how to browse from a mobile device
        allowedHosts: [
            '.homeawaycorp.com',
            '.wvrgroup.internal'
        ],

        // Enables support for hosting HMR sockets
        hot: true,

        // This ensures that we don't refresh the page when the
        // bundle recovers from a build failure. If you fix the
        // build, then only the fixed module will get hot-reloaded.
        hotOnly: true,

        overlay: {
            errors: true
        },

        // Pass requests on 8080 through to the hapi server on 8081.
        // The dev server will intercept the requests for the webpack bundles.
        proxy: {
            '/': {
                target: 'http://localhost:8081',
                onError: (err, req, res) => {
                    if (err.code === 'ECONNREFUSED') {
                        // Try again after 3 secs
                        res.writeHead(503, { 'Content-Type': 'text/html; charset=utf-8', 'Refresh': '3' });
                        res.end('<p style="font-family:sans-serif;">Connecting to hapi server. One moment...<br/><progress style="width:300px;"></progress></p>');
                    }
                    else {
                        throw err;
                    }
                }
            }
        },

        stats: 'minimal',

        // For logging HMR information in the browser console, see:
        // https://webpack.js.org/configuration/dev-server/#devserver-clientloglevel
        clientLogLevel: 'none'
    },

    // See: https://webpack.js.org/configuration/devtool/#devtool
    devtool: 'cheap-module-inline-source-map'
});
