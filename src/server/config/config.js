const os = require('os');
const hostname = os.hostname();

module.exports = {
    statsd: {
        appName: 'opxhub-ui',
        hostName: hostname,
        port: 8125,
        host: 'statsd',
        debug: false
    }
};