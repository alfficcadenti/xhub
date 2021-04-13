import { selectedBrand } from '../utils/brand';
import { TIMEOUT_NEW_PAGE } from '../utils/consts';

export const navigateToHomepage = async (browser, brand) => {
    const brandName = selectedBrand[brand]
    const completeUrl = `https://opxhub-ui.us-east-1.prod.expedia.com/home?selectedBrand=${brandName}`;
    console.info(`[info] Navigate to: ${completeUrl}`);
    await browser.navigate(completeUrl);
};

export const verifyElement = async (browser, element, state) => {
    if (state === 'visible') {
        await browser.expect.element(element).to.be.visible;

        return;
    }

    if (state === 'present') {
        await browser.expect.element(element).to.be.present;

        return;
    }

    if (state === 'not visible') {
        await browser.expect.element(element).not.to.be.visible;

        return;
    }

    if (state === 'not present') {
        await browser.expect.element(element).not.to.be.present;

        return;
    }

    throw new Error('State of element not identified');
};

export const waitForElement = async (browser, element, state) => {
    if (state === 'visible') {
        await browser.expect.element(element).to.be.visible.before(TIMEOUT_NEW_PAGE);

        return;
    }

    if (state === 'present') {
        await browser.expect.element(element).to.be.present.before(TIMEOUT_NEW_PAGE);

        return;
    }

    if (state === 'not visible') {
        await browser.expect.element(element).not.to.be.visible.before(TIMEOUT_NEW_PAGE);

        return;
    }

    if (state === 'not present') {
        await browser.expect.element(element).not.to.be.present.before(TIMEOUT_NEW_PAGE);

        return;
    }

    throw new Error('State of element not identified');
};

export const verifyHomePageLinkExist = async (browser, element) => {
    await verifyElement(browser, `${element}`, 'visible');
};

export const clickOnHomePageLink = async (browser, element) => {
    await waitForElement(browser,`${element}`,'present');
    await browser.click(`${element}`);
};

export const verifyTitleMatch = async (browser, element, title) => {
    await browser.expect.element(`${element}`).text.to.contain(`${title}`);
};

export const changeAndVerifyInputValue = async (browser, element, value) => {
    await waitForElement(browser,`${element}`,'present');
    await browser.setValue(element, value);
    await browser.expect.element(element).to.have.attribute('value');
}