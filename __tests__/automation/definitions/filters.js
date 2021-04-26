import { Then } from 'cucumber';
import { client } from 'nightwatch-api';
import { selectStartingDate, selectEndingDate, selectOneElementOfFilter, selectAdvanceFilters, setTimeFilter, selectAnnotationsFilter, clickOn, waitForElement, selectCorrectiveActions } from '../methods';

const pageFilters = client.page.filters_pageObj();

Then(/^user selects start date/, async () => {
    await selectStartingDate(pageFilters);
});

Then(/^user selects end date/, async () => {
    await selectEndingDate(pageFilters);
});

Then(/^waiting for (.*)/, async element => {
    if (element) {
        await waitForElement(pageFilters, `@${element}`, 'visible');
    } else {
        return;
    }
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
    await clickOn(pageFilters, element)
});

Then(/^conditional click on (.*) (.*)/, async (element, skip) => {
    if(!skip) {
        await clickOn(pageFilters, element)
    } else return;
});

Then(/^select Corrective Actions/, async () => {
    await selectCorrectiveActions(pageFilters)
});
