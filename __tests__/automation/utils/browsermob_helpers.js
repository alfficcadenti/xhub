const MobProxy = require('browsermob-proxy-api');

const HOST_NAME = process.env.DA_HUB_IP || 'localhost';
const BROWSER_MOB_PORT = '8080';
const BASE_PROXY_PORT = 8081;
const CUCUMBER_WORKER_ID =
    process.env.CUCUMBER_SLAVE_ID === undefined ? 0 : parseInt(process.env.CUCUMBER_SLAVE_ID, 10);
const PROCESS_PROXY_PORT = (BASE_PROXY_PORT + CUCUMBER_WORKER_ID).toString();
const START_PORT_PARAMS = {
    port: PROCESS_PROXY_PORT,
    trustAllServers: 'true'
};
const CREATE_HAR_PARAMS = {
    captureContent: 'true',
    captureHeaders: 'true'
};
const MOB_PROXY = new MobProxy({
    host: HOST_NAME,
    port: BROWSER_MOB_PORT
});

module.exports = {
    getHARFile: () =>
        new Promise((resolve, reject) => {
            MOB_PROXY.getHAR(PROCESS_PROXY_PORT, (err, data) => {
                if (err !== null) {
                    reject(new Error(`Error getting network HAR file: ${err}`));
                }
                const jsonData = JSON.parse(data);
                resolve(jsonData);
            });
        }),

    getProxyPort: () => PROCESS_PROXY_PORT,
    setupProxy: () =>
        new Promise((resolve, reject) => {
            MOB_PROXY.startPort(START_PORT_PARAMS, (err) => {
                if (err !== null) {
                    reject(new Error(`Failed to connect to Proxy: ${err}`));
                }
                MOB_PROXY.createHAR(PROCESS_PROXY_PORT, CREATE_HAR_PARAMS, () => {
                    resolve();
                });
            });
        }),

    teardownProxy: () =>
        new Promise((resolve, reject) => {
            MOB_PROXY.stopPort(PROCESS_PROXY_PORT, (err) => {
                if (err !== null) {
                    console.error(`failed to shutdown proxy ${err}`);
                    reject(err);
                }
                resolve();
            });
        }),
};