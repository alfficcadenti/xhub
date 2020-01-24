const S3Plugin = require('webpack-s3-plugin');
// For prod, we use the same common bucket as Expedia, but push assets into a subfolder based on app name

const {version} = require('../../config/buildInfo');
const output = [];

if (process.env.UPLOAD_ASSETS !== 'false') {
    output.push(new S3Plugin({
        exclude: /.*\.html$/,
        basePath: '',
        s3Options: {
            region: ''
        },
        s3UploadOptions: {
            Bucket: `ewe-assets/opxhub-ui/${version}/assets`,
            CacheControl: 'max-age=315360000, no-transform, public'
        }
    }));
}

module.exports = output;
