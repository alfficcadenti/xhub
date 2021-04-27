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
    await browser.click('@dateYear');
    await browser.click('@dateMonth');
    await browser.click('@dateDay');
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

export const setValueOfInput = async (browser, input) => {
    await browser.click(`@${input}`);
    await browser.setValue(`@${input}`, 'search');
    await browser.expect.element(`@${input}`).to.have.value.that.equals('search');
};

export const selectAnnotationsFilter = async browser => {
    await browser.click('@annotationsButton')
    await waitForElement(browser, '@annotationsContainer', 'visible');
    await browser.click('@annotationsRemoveButton');
    await browser.setValue('@annotationsSearchInput', 'search');
    await browser.expect.element('@annotationsSearchInput').to.have.value.that.equals('search');
    await browser.click('@annotationsDeploymentsInput');
    await browser.expect.element('@annotationsDeploymentsInput').to.be.present.after(2000);
    await browser.click('@annotationsDeploymentsInput');
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
    await browser.click('@modalCloseButton');
};