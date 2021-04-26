import { Then } from 'cucumber';
import { client } from 'nightwatch-api';
import { selectStartingDate, selectEndingDate, selectOneElementOfFilter, selectAdvanceFilters, setTimeFilter, selectAnnotationsFilter, clickOn, waitForElement, selectCorrectiveActions, setValueOfInput } from '../methods';

const pageFilters = client.page.filters_pageObj();

Then(/^user selects start date/, async () => {
    await selectStartingDate(pageFilters);
});

Then(/^user selects end date/, async () => {
    await selectEndingDate(pageFilters);
});

Then(/^waiting for (.*)/, async element => {
    await waitForElement(pageFilters, `@${element}`, 'visible')
});

Then(/^wait for data reload (.*) (.*)/, async (element, loader) => {
    if(element && loader) {
        await waitForElement(pageFilters, `@${loader}`, 'not present')
        await waitForElement(pageFilters, `@${element}`, 'present')
    } else return;
});

Then(/^user selects one element of filter (.*) (.*)/, async (button, listElement) => {
    if (button && listElement) {
        await selectOneElementOfFilter(pageFilters, button, listElement);
    } else return;
});

Then(/^select advance filters/, async () => {
    await selectAdvanceFilters(pageFilters);
});

Then(/^select annotations filter/, async () => {
    await selectAnnotationsFilter(pageFilters);
});

Then(/^set time filter/, async () => {
    await setTimeFilter(pageFilters);
});

Then(/^click on (.*)/, async element => {
    if(element) {
        await clickOn(pageFilters, element)
    } else return;
});

Then(/^conditional click on (.*) (.*)/, async (element, skip) => {
    if(!skip) {
        await clickOn(pageFilters, element)
    } else return;
});

Then(/^select Corrective Actions/, async () => {
    await selectCorrectiveActions(pageFilters)
});

Then(/^set value of input (.*)/, async input => {
    await setValueOfInput(pageFilters, input);
});