const {client} = require('nightwatch-api');
const {Given, Then} = require('cucumber');
const {checkRoutes, setLinks, setBrands} = require('../methods');
import {getPageObject} from 'common-nightwatch/methods/common_methods';

const homepage = getPageObject(client, 'homepage');

let links = [];
let brands = [];

Given(/^open homepage and set brands$/, async () => {
    brands = await setBrands(client);
});

Then(/^set links 1$/, async () => {
    links = await setLinks(client, links);
});

Then(/^check routes (1)$/, async (id) => {
    await checkRoutes(homepage, links, brands, id);
});

Then(/^set links 2$/, async () => {
    links = await setLinks(client, links);
});

Then(/^check routes (2)$/, async (id) => {
    await checkRoutes(homepage, links, brands, id);
});

Then(/^set links 3$/, async () => {
    links = await setLinks(client, links);
});

Then(/^check routes (3)$/, async (id) => {
    await checkRoutes(homepage, links, brands, id);
});

Then(/^set links 4$/, async () => {
    links = await setLinks(client, links);
});

Then(/^check routes (4)$/, async (id) => {
    await checkRoutes(homepage, links, brands, id);
});

Then(/^set links 5$/, async () => {
    links = await setLinks(client, links);
});

Then(/^check routes (5)$/, async (id) => {
    await checkRoutes(homepage, links, brands, id);
});

Then(/^set links 6$/, async () => {
    links = await setLinks(client, links);
});

Then(/^check routes (6)$/, async (id) => {
    await checkRoutes(homepage, links, brands, id);
});