import { waitForElement } from './common-method'

export const selectStartingDate = async browser => {
    await browser.click('@dateStart');
    await browser.click('@dateSwitch');
    await browser.click('@datePrev');
    await browser.click('@dateNext');
    await browser.click('@dateSwitch');
    await browser.click('@dateSwitch');
    await browser.click('@dateYear');
    await browser.click('@dateMonth');
    await browser.click('@dateDay');
};

export const selectEndingDate = async browser => {
    await browser.click('@dateEnd');
    await browser.click('@dateSwitch');
    await browser.click('@datePrev');
    await browser.click('@dateNext');
    await browser.click('@dateSwitch');
    await browser.click('@dateSwitch');
};

export const selectOneElementOfFilter = async (browser, button, listElement) => {
    await waitForElement(browser, `@${button}`, 'present');
    await browser.click(`@${button}`);
    await waitForElement(browser, `@${listElement}`, 'visible');
    await browser.click(`@${listElement}`);
};

export const clickOn = async (browser, element) => {
    await browser.click(`@${element}`)
}

export const selectAdvanceFilters = async browser => {
    await browser.click('@moreFiltersButton');
    await waitForElement(browser, '@deviceFilter', 'visible');
    await browser.click('@deviceFilter');
    await browser.click('@deviceOptionFilter');
};

export const selectAnnotationsFilter = async browser => {
    await browser.click('@annotationsButton')
    await waitForElement(browser, '@annotationsContainer', 'visible');
    await browser.setValue('@annotationsSearchInput', 'search');
};

export const selectCorrectiveActions = async browser => {
    await browser.click('@l1TableArrow')
    await waitForElement(browser, '@l2TableContainer', 'visible');
    await browser.click('@l2TableArrow')
    await waitForElement(browser, '@l3TableContainer', 'visible');
    await browser.click('@l3TableArrow')
    await waitForElement(browser, '@l4TableContainer', 'visible');
    await browser.click('@l4TableArrow')
    await waitForElement(browser, '@l5TableContainer', 'visible');
    await browser.click('@correctiveActionsModalOpener');
    await waitForElement(browser, '@correctiveActionsModalContainer', 'present');
    await browser.click('@correctiveActionsModalSettingsButton');
    await waitForElement(browser, '@correctiveActionsModalSettingsContainer', 'visible');
    await browser.click('@correctiveActionsModalSettingsInput');
    await browser.click('@correctiveActionsModalCloseButton');
};