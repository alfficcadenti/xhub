import { Given } from 'cucumber';
import { client } from 'nightwatch-api';
import { navigateToHomepage, navigateToOkta } from '../methods';
import { saveBrowserInfo } from 'common-nightwatch/methods/common_methods'

const pages = client.page.navigation_pageObj();
const authPage = client.page.auth_pageObj();

Given(/^user goes to okta/, async () => {
    await navigateToOkta(authPage);
});

Given(/^user visit opXHub homepage on (.*)/, async brand => {
    await saveBrowserInfo(pages);
    await navigateToHomepage(pages, brand);
});
