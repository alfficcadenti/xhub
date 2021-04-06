import { Then } from 'cucumber';
import { client } from 'nightwatch-api';
import { waitForElement, changeAndVerifyInputValue, submitForm } from '../methods';

const pageElements = client.page.auth_pageObj();

Then(/^user wait for login page/, async () => {
    await waitForElement(pageElements, '@loginContainer', 'present')
});

Then(/^user wait for password page/, async () => {
    await waitForElement(pageElements, '@loginForm', 'not present')
    await waitForElement(pageElements, '@passwordForm', 'present')
});

Then(/^user types username in login/, async () => {
    await changeAndVerifyInputValue(pageElements, '@loginInput', process.env.OKTA_LOGIN_USERNAME)
});

Then(/^user types password in password/, async () => {
    await changeAndVerifyInputValue(pageElements, '@passwordInput', process.env.OKTA_LOGIN_PASSWORD)
});

Then(/^user clicks submit/, async () => {
    await submitForm(pageElements, '@formSubmitButton')
});

Then(/^user clicks verify/, async () => {
    await submitForm(pageElements, '@passwordSubmitButton')
});

Then(/^user wait to successfully login/, async () => {
    await waitForElement(pageElements, '@appContainer', 'present')
});