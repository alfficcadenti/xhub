const {client} = require('nightwatch-api');
const {Given, Then} = require('cucumber');
const {checkRoutes, setLinks, setBrands, selectFilters} = require('../methods');

let links = [];
let brands = [];

Given(/^open homepage and set brands$/, async () => {
    brands = await setBrands(client);
});

Then(/^set links 1$/, async () => {
    links = await setLinks(client, links);
});

Then(/^check routes 1$/, async () => {
    await checkRoutes(client, links);
});

Then(/^select filters (2)$/, async (id) => {
    await selectFilters(client, brands, id);
});

Then(/^set links 2$/, async () => {
    links = await setLinks(client, links);
});

Then(/^check routes 2$/, async () => {
    await checkRoutes(client, links);
});

Then(/^select filters (3)$/, async (id) => {
    await selectFilters(client, brands, id);
});

Then(/^set links 3$/, async () => {
    links = await setLinks(client, links);
});

Then(/^check routes 3$/, async () => {
    await checkRoutes(client, links);
});

Then(/^select filters (4)$/, async (id) => {
    await selectFilters(client, brands, id);
});

Then(/^set links 4$/, async () => {
    links = await setLinks(client, links);
});

Then(/^check routes 4$/, async () => {
    await checkRoutes(client, links);
});

Then(/^select filters (5)$/, async (id) => {
    await selectFilters(client, brands, id);
});

Then(/^set links 5$/, async () => {
    links = await setLinks(client, links);
});

Then(/^check routes 5$/, async () => {
    await checkRoutes(client, links);
});

Then(/^select filters (6)$/, async (id) => {
    await selectFilters(client, brands, id);
});

Then(/^set links 6$/, async () => {
    links = await setLinks(client, links);
});

Then(/^check routes 6$/, async () => {
    await checkRoutes(client, links);
});