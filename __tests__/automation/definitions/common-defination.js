import { Given } from 'cucumber';
import { client } from 'nightwatch-api';
import { navigateToHomepage } from '../methods';
import { saveBrowserInfo } from 'common-nightwatch/methods/common_methods'

const homepage = client.page.homepage_pageObj();

Given(/^user visit opXHub homepage on (.*)/, async brand => {
    await saveBrowserInfo(homepage);
    await navigateToHomepage(homepage, brand);
});
