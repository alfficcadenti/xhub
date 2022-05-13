const {resolve} = require('path');

const assetsRootPath = 'build/static';
const assetSizeConfig = 'assetSizeConfig.json';

function absolutePath(fileName = '') {
    return resolve(__dirname, '..', '..', assetsRootPath, fileName);
}

(async () => {
    try {
        const manifest = require(absolutePath('manifest.json'));
        const bundleSizeConfig = require(resolve(__dirname, '..', '..', assetSizeConfig));
        const stats = require(absolutePath('stats.json')).assets;

        const assetSizeCheckResult = Object.entries(bundleSizeConfig)
            .map(([bundleName, threshold]) => {
                const fileStat = stats.find(({name}) => name === manifest[bundleName]);
                const fileSize = fileStat ? fileStat.size : 0;

                if (fileSize > threshold) {
                    return `${bundleName} threshold: ${threshold} size: ${fileSize}`;
                }
                return '';
            })
            .filter((resultText) => resultText !== undefined);

        if (assetSizeCheckResult.length > 0) {
            throw new Error(assetSizeCheckResult);
        }
    } catch (e) {
        console.log('Asset size check failed: ', e); // eslint-disable-line
        process.exit(1);
    }
})();
