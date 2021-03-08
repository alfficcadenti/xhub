const {client} = require('nightwatch-api');
const {Given, Then} = require('cucumber');
const {setNav, setLinks} = require('../methods');
import {PAUSE_TIMEOUT_1000} from '../utils/consts';

let links = [];
const brands = [];

Given(/^open localhost homepage$/, async () => {
    await client
        .url('https://opxhub-ui.us-west-2.test.expedia.com/home?selectedBrand=Expedia%20Group')
        .waitForElementVisible('body', 1000)
        .elements('css selector', '.home-buttons-container a', (elements) => {
            elements.value.forEach((elementsObj) => {
                client.elementIdAttribute(elementsObj[Object.keys(elementsObj)], 'href', (result) => {
                    links.push(result.value);
                });
            });
        })
        .elements('css selector', '#brand-selector--container li', (elements) => {
            elements.value.forEach((elementsObj) => {
                console.log(elementsObj, 'ELEMENTSSSSSSSS');
                client.elementIdAttribute(elementsObj[Object.keys(elementsObj)], 'textContent', (result) => {
                    let text = result.value.includes('Retail') ? result.value.slice(0, -7) : result.value;

                    brands.push({
                        url: encodeURIComponent(text),
                        text
                    });
                });
            });
        });
});

Then(/^check routes 1$/, async () => {
    await setNav(client, links);
});

Then(/^select filters 2$/, async () => {
    await client
        .pause(PAUSE_TIMEOUT_1000)
        .click('#brand-selector')
        .click('.Dropdown__menu--open li:nth-child(2)')
        .assert.urlContains(`selectedBrand=${brands[1].url}`, `Params: Brand is ${brands[1].text}`);
});

Then(/^set links 2$/, async () => {
    links = await setLinks(client, links);
});

Then(/^check routes 2$/, async () => {
    await setNav(client, links);
});

Then(/^select filters 3$/, async () => {
    await client
        .pause(PAUSE_TIMEOUT_1000)
        .click('#brand-selector')
        .click('.Dropdown__menu--open li:nth-child(3)')
        .assert.urlContains(`selectedBrand=${brands[2].url}`, `Params: Brand is ${brands[2].text}`);
});

Then(/^set links 3$/, async () => {
    links = await setLinks(client, links);
});

Then(/^check routes 3$/, async () => {
    await setNav(client, links);
});

Then(/^select filters 4$/, async () => {
    await client
        .pause(PAUSE_TIMEOUT_1000)
        .click('#brand-selector')
        .click('.Dropdown__menu--open li:nth-child(4)')
        .assert.urlContains(`selectedBrand=${brands[3].url}`, `Params: Brand is ${brands[3].text}`);
});

Then(/^set links 4$/, async () => {
    links = await setLinks(client, links);
});

Then(/^check routes 4$/, async () => {
    await setNav(client, links, !links[1].includes('fci'), true);
});

Then(/^select filters 5$/, async () => {
    await client
        .pause(PAUSE_TIMEOUT_1000)
        .click('#brand-selector')
        .click('.Dropdown__menu--open li:nth-child(5)')
        .assert.urlContains(`selectedBrand=${brands[4].url}`, `Params: Brand is ${brands[4].text}`);
});

Then(/^set links 5$/, async () => {
    links = await setLinks(client, links);
});

Then(/^check routes 5$/, async () => {
    await setNav(client, links);
});

Then(/^select filters 6$/, async () => {
    await client
        .pause(PAUSE_TIMEOUT_1000)
        .click('#brand-selector')
        .click('.Dropdown__menu--open li:nth-child(6)')
        .assert.urlContains(`selectedBrand=${brands[5].url}`, `Params: Brand is ${brands[5].text}`);
});

Then(/^set links 6$/, async () => {
    links = await setLinks(client, links);
});

Then(/^check routes 6$/, async () => {
    await setNav(client, links);
});
