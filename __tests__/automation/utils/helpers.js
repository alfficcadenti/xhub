let scenarioLogStr = '';

module.exports = {
    saveConsoleInfo: (info) => {
        if (!info || !info.length) {
            return;
        }
        const text = info.join('');
        scenarioLogStr += `${text}\n` ;
    },
    getConsoleInfo: (callback) => {
        callback(scenarioLogStr);
        scenarioLogStr = '';
    },
};