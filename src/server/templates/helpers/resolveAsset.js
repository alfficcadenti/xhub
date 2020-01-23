const debug = require('debug')('catalyst-app:resolve-asset');

const isProd = process.env.NODE_ENV === 'production';
const hasCdn = !!process.env.CDN_URL;
let prefix = '/';
if (hasCdn) {
    const {version} = require('../../../../config/buildInfo');
    prefix = `${process.env.CDN_URL}/opxhub/${version}/assets/`;
}

let manifest;

if (isProd) {
    try {
        manifest = require('../../../static/manifest.json');
        debug('Loaded manifest %o', manifest);
    } catch (err) {
        debug('FAILED! to load manifest', err);
    }
}

module.exports = function resolveAssetHelper(asset) {
    return `${prefix}${(manifest && manifest[asset]) || asset}`;
};
