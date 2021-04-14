import { Then } from 'cucumber';
import { client } from 'nightwatch-api';
import { selectStartingDate, selectEndingDate, selectBrandFilter, selectLobFilter, selectPosFilter, resetFilters, submitFilters, selectCheckboxes, selectIncidentsFilter, selectAnomaliesFilter, selectAdvanceFilters, setTimeFilter, resetGraph } from '../methods';

const pageFilters = client.page.filters_pageObj();

Then(/^user selects start date/, async () => {
    await selectStartingDate(pageFilters);
});

Then(/^user selects end date/, async () => {
    await selectEndingDate(pageFilters);
});

Then(/^user selects brand filter/, async () => {
    await selectBrandFilter(pageFilters);
});

Then(/^user selects lob filter/, async () => {
    await selectLobFilter(pageFilters);
});

Then(/^user selects pos filter/, async () => {
    await selectPosFilter(pageFilters);
});

Then(/^submit filters/, async () => {
    await submitFilters(pageFilters);
});

Then(/^reset filters/, async () => {
    await resetFilters(pageFilters);
});

Then(/^select checkboxes/, async () => {
    await selectCheckboxes(pageFilters);
});

Then(/^select incidents filter/, async () => {
    await selectIncidentsFilter(pageFilters);
});

Then(/^select anomalies filter/, async () => {
    await selectAnomaliesFilter(pageFilters);
});

Then(/^select advance filters/, async () => {
    await selectAdvanceFilters(pageFilters);
});

Then(/^set time filter/, async () => {
    await setTimeFilter(pageFilters);
});

Then(/^reset graph/, async () => {
    await resetGraph(pageFilters);
});