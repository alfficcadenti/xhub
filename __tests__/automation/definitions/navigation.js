import { Then } from 'cucumber';
import { client } from 'nightwatch-api';
import { waitForElement, verifyHomePageLinkExist, clickOnHomePageLink, verifyTitleMatch } from '../methods';
import { dropdownAndLinks } from '../utils/dropdownAndLinks'

const pages = client.page.navigation_pageObj();
const pageElements = client.page.common_pageObj();

Then(/^the current page is homepage/, async () => {
    await waitForElement(pages, '@homeButtonsContainer', 'present');
});

Then(/^user clicks on the (.*)/, async linkText => {
    const element = dropdownAndLinks[linkText];
    await clickOnHomePageLink (pages, `@${element}`);
});

Then (/^user verify (.*) exist/, async element => {
    await verifyHomePageLinkExist(pages, `@${element}`);
});

Then(/^user go ahead and clicks on the (.*)/, async element => {
    await clickOnHomePageLink (pages, `@${element}`);
});

Then(/^user wait for the data to load/, async () => {
    await waitForElement(pageElements, '@loader', 'not present')
});

Then(/^the current page title contain (.*)/, async title => {
    await waitForElement(pageElements, '@pageTitle', 'present');
    await verifyTitleMatch (pageElements, '@pageTitle', `${title}`);
});