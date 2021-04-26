import {Before, After} from 'cucumber';
import {client} from 'nightwatch-api';
import {exportBrowserstackSessionsFile, getConsoleInfo} from './helpers';

import {navigateToOkta} from '../methods/auth-method'
import { waitForElement, changeAndVerifyInputValue, submitForm } from '../methods';

const pageElements = client.page.auth_pageObj();
const authPage = client.page.auth_pageObj();

Before(async function () {
    await navigateToOkta(authPage);
    await waitForElement(pageElements, '@loginContainer', 'present');
    await changeAndVerifyInputValue(pageElements, '@loginInput', process.env.OKTA_LOGIN_USERNAME);
    await submitForm(pageElements, '@formSubmitButton');
    await waitForElement(pageElements, '@loginForm', 'not present');
    await waitForElement(pageElements, '@passwordForm', 'present');
    await changeAndVerifyInputValue(pageElements, '@passwordInput', process.env.OKTA_LOGIN_PASSWORD);
    await submitForm(pageElements, '@passwordSubmitButton');
    await waitForElement(pageElements, '@appContainer', 'present');
});

After(async function (scenario) {
    if (process.env.isBrowserstack && scenario.result.status === 'failed') {
        await exportBrowserstackSessionsFile(client, scenario);
        console.info('[info:After]: Browser Stack sessions file saved');
    }

    if (scenario.result.retried) {
        console.info('[info:Retry] Test in progress!');
    }

    getConsoleInfo(logString => {
        if (logString) {
            const base64Str = Buffer.from(`executionLog: ${logString}`).toString('base64');
            this.attach(JSON.stringify(base64Str, null, 2), 'text/plain');
        }
    });
});