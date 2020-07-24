
const config = require('./production');
const path = require('path');

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
    .BundleAnalyzerPlugin;

const reportFilename = path.join(__dirname, '../../reports/report.html');

config.plugins.push(
    new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        analyzerHost: '127.0.0.1',
        analyzerPort: 8888,
        reportFilename,
        defaultSizes: 'parsed',
        openAnalyzer: true,
        generateStatsFile: false,
        statsFilename: `${process.cwd()}/stats.json`,
        statsOptions: null,
        logLevel: 'info'
    })
);


module.exports = config;
