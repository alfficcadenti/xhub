import { Then } from 'cucumber';
import { client } from 'nightwatch-api';
import { selectStartingDate, selectEndingDate, selectOneElementOfFilter, selectAdvanceFilters, setTimeFilter, selectAnnotationsFilter, clickOn } from '../methods';

const pageFilters = client.page.filters_pageObj();

Then(/^user selects start date/, async () => {
    await selectStartingDate(pageFilters);
});

Then(/^user selects end date/, async () => {
    await selectEndingDate(pageFilters);
});

Then(/^user selects one element of filter (.*) (.*)/, async (button, listElement) => {
    await selectOneElementOfFilter(pageFilters, button, listElement);
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