const debug = require('debug')('catalyst-app:build-info');
const BUILD_INFO_FILE_PATH = '../../config/buildInfo';

const isProd = process.env.NODE_ENV === 'production';
const cdnUrl = process.env.CDN_URL;

// used for `/buildInfo` endpoint.

let buildInfo;
try {
    if (isProd && cdnUrl) {
        buildInfo = require(BUILD_INFO_FILE_PATH);
    }
} catch (err) {
    debug('Failed to load build config: %O', err);
    buildInfo = {version: 'unknown'};
}

function buildInfoHandler(request, h) {
    return h.response(buildInfo).code(200);
}

module.exports = {buildInfo: () => buildInfoHandler};
