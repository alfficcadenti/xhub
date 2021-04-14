import { waitForElement } from './common-method'

export const selectStartingDate = async browser => {
    await browser.click('@dateStart');
    await browser.click('@dateTimeToggle');
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
    await browser.click('@dateTimeToggle');
    await browser.click('@dateSwitch');
    await browser.click('@datePrev');
    await browser.click('@dateNext');
    await browser.click('@dateSwitch');
    await browser.click('@dateSwitch');
};

export const selectBrandFilter = async browser => {
    await browser.click('@brandFilter');
    await browser.click('@brandOptionFilter1');
    await browser.click('@brandFilter');
    await browser.click('@brandOptionFilter2');
};

export const selectLobFilter = async browser => {
    await browser.click('@lobFilter');
    await browser.click('@lobOptionFilter');
};

export const selectPosFilter = async browser => {
    await browser.click('@posFilter');
    await browser.click('@posOptionFilter');
};

export const submitFilters = async browser => {
    await browser.click('@submitFilters')
};

export const resetFilters = async browser => {
    await browser.click('@resetFilters')
};

export const selectCheckboxes = async browser => {
    await browser.click('@incidentsCheckbox');
    await browser.click('@anomaliesCheckbox');
};

export const selectIncidentsFilter = async browser => {
    await browser.click('@incidentsFilter');
    await browser.click('@incidentsOptionFilter');
};

export const selectAnomaliesFilter = async browser => {
    await browser.click('@anomaliesFilter');
    await browser.click('@anomaliesOptionFilter');
};

export const selectAdvanceFilters = async browser => {
    await browser.click('@moreFiltersButton');
    await waitForElement(browser, '@deviceFilter', 'visible');
    await browser.click('@deviceFilter');
    await browser.click('@deviceOptionFilter');
};

export const setTimeFilter = async browser => {
    await browser.click('@setTimeFilter');
    await browser.click('@setTimeFilterOption');
};

export const resetGraph = async browser => {
    await browser.click('@resetGraph');
};