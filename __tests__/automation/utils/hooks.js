import {Before, After} from 'cucumber';
import {client} from 'nightwatch-api';
import {exportBrowserstackSessionsFile, getConsoleInfo} from './helpers';

Before('@skip', () => 'skipped');

After(async function (scenario) {
    if (process.env.isBrowserstack && scenario.result.status === 'failed') {
        await exportBrowserstackSessionsFile(client, scenario);
        console.info('[info:After]: Browser Stack sessions file saved');
    }

    if (scenario.result.retried) {
        console.info('[info:Retry] Test in progress!');
    }

    getConsoleInfo((logString) => {
        if (logString) {
            const base64Str = Buffer.from(`executionLog: ${logString}`).toString('base64');
            this.attach(JSON.stringify(base64Str, null, 2), 'text/plain');
        }
    });
});