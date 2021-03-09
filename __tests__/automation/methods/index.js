module.exports = {
    checkRoutes: async (client, links) => {
        if (links.length === 6) {
            await client
                .click('button[id="Availability & Trends-dropdown"]')
                .waitForElementVisible('ul[id="Availability & Trends-dropdown--container"]')
                .click('ul[id="Availability & Trends-dropdown--container"] a')
                .assert.urlContains(`${links[0]}`, `Params: url is ${links[0]}`)
                .waitForElementNotPresent('.LoadingOverlay__ul', 60000)

                .click('button[id="Platform Health & Resiliency-dropdown"]')
                .waitForElementVisible('ul[id="Platform Health & Resiliency-dropdown--container"]')
                .click('ul[id="Platform Health & Resiliency-dropdown--container"] a')
                .assert.urlContains(`${links[1]}`, `Params: url is ${links[1]}`)
                .waitForElementNotPresent('.LoadingOverlay__ul', 60000)

                .click('button[id="Platform Health & Resiliency-dropdown"]')
                .waitForElementVisible('ul[id="Platform Health & Resiliency-dropdown--container"]')
                .click('ul[id="Platform Health & Resiliency-dropdown--container"] li:nth-of-type(2) a')
                .assert.urlContains(`${links[2]}`, `Params: url is ${links[2]}`)
                .waitForElementNotPresent('.LoadingOverlay__ul', 60000)

                .click('button[id="Platform Health & Resiliency-dropdown"]')
                .waitForElementVisible('ul[id="Platform Health & Resiliency-dropdown--container"]')
                .click('ul[id="Platform Health & Resiliency-dropdown--container"] li:nth-of-type(3) a')
                .assert.urlContains('prb', `Params: url is ${links[3]}`)
                .waitForElementNotPresent('.LoadingOverlay__ul', 60000)

                .click('button[id="Platform Health & Resiliency-dropdown"]')
                .waitForElementVisible('ul[id="Platform Health & Resiliency-dropdown--container"]')
                .click('ul[id="Platform Health & Resiliency-dropdown--container"] li:nth-of-type(4) a')
                .assert.urlContains(`${links[4]}`, `Params: url is ${links[4]}`)
                .waitForElementNotPresent('.LoadingOverlay__ul', 60000)

                .click('button[id="Outage Report-dropdown"]')
                .click('ul[id="Outage Report-dropdown--container"] a')
                .assert.urlContains(`${links[5]}`, `Params: url is ${links[5]}`)
                .waitForElementNotPresent('.LoadingOverlay__ul', 60000)

                .url('https://opxhub-ui.us-west-2.test.expedia.com/home?selectedBrand=Expedia%20Group')
                .waitForElementVisible('body');
        } else if (links.length === 8) {
            await client
                .click('button[id="Availability & Trends-dropdown"]')
                .waitForElementVisible('ul[id="Availability & Trends-dropdown--container"]')
                .click('ul[id="Availability & Trends-dropdown--container"] a')
                .assert.urlContains(`${links[0]}`, `Params: url is ${links[0]}`)
                .waitForElementNotPresent('.LoadingOverlay__ul', 60000)

                .click('button[id="Availability & Trends-dropdown"]')
                .waitForElementVisible('ul[id="Availability & Trends-dropdown--container"]')
                .click('ul[id="Availability & Trends-dropdown--container"] li:nth-of-type(2) a')
                .assert.urlContains(`${links[1]}`, `Params: url is ${links[1]}`)
                .waitForElementNotPresent('.LoadingOverlay__ul', 60000)

                .click('button[id="Availability & Trends-dropdown"]')
                .waitForElementVisible('ul[id="Availability & Trends-dropdown--container"]')
                .click('ul[id="Availability & Trends-dropdown--container"] li:nth-of-type(3) a')
                .assert.urlContains(`${links[2]}`, `Params: url is ${links[2]}`)
                .waitForElementNotPresent('.LoadingOverlay__ul', 60000)

                .click('button[id="Platform Health & Resiliency-dropdown"]')
                .waitForElementVisible('ul[id="Platform Health & Resiliency-dropdown--container"]')
                .click('ul[id="Platform Health & Resiliency-dropdown--container"] a')
                .assert.urlContains(`${links[3]}`, `Params: url is ${links[3]}`)
                .waitForElementNotPresent('.LoadingOverlay__ul', 60000)

                .click('button[id="Platform Health & Resiliency-dropdown"]')
                .waitForElementVisible('ul[id="Platform Health & Resiliency-dropdown--container"]')
                .click('ul[id="Platform Health & Resiliency-dropdown--container"] li:nth-of-type(2) a')
                .assert.urlContains(`${links[4]}`, `Params: url is ${links[4]}`)
                .waitForElementNotPresent('.LoadingOverlay__ul', 60000)

                .click('button[id="Platform Health & Resiliency-dropdown"]')
                .waitForElementVisible('ul[id="Platform Health & Resiliency-dropdown--container"]')
                .click('ul[id="Platform Health & Resiliency-dropdown--container"] li:nth-of-type(3) a')
                .assert.urlContains('prb', `Params: url is ${links[5]}`)
                .waitForElementNotPresent('.LoadingOverlay__ul', 60000)

                .click('button[id="Platform Health & Resiliency-dropdown"]')
                .waitForElementVisible('ul[id="Platform Health & Resiliency-dropdown--container"]')
                .click('ul[id="Platform Health & Resiliency-dropdown--container"] li:nth-of-type(4) a')
                .assert.urlContains(`${links[6]}`, `Params: url is ${links[6]}`)
                .waitForElementNotPresent('.LoadingOverlay__ul', 60000)

                .click('button[id="Outage Report-dropdown"]')
                .waitForElementVisible('ul[id="Outage Report-dropdown--container"]')
                .click('ul[id="Outage Report-dropdown--container"] a')
                .assert.urlContains(`${links[7]}`, `Params: url is ${links[7]}`)
                .waitForElementNotPresent('.LoadingOverlay__ul', 60000)

                .url('https://opxhub-ui.us-west-2.test.expedia.com/home?selectedBrand=Expedia%20Group')
                .waitForElementVisible('body');
        } else if (links.length === 9) {
            await client
                .click('button[id="Availability & Trends-dropdown"]')
                .waitForElementVisible('ul[id="Availability & Trends-dropdown--container"]')
                .click('ul[id="Availability & Trends-dropdown--container"] a')
                .assert.urlContains(`${links[0]}`, `Params: url is ${links[0]}`)
                .waitForElementNotPresent('.LoadingOverlay__ul', 60000)

                .click('button[id="Availability & Trends-dropdown"]')
                .waitForElementVisible('ul[id="Availability & Trends-dropdown--container"]')
                .click('ul[id="Availability & Trends-dropdown--container"] li:nth-of-type(2) a')
                .assert.urlContains(`${links[1]}`, `Params: url is ${links[1]}`)
                .waitForElementNotPresent('.LoadingOverlay__ul', 60000)

                .click('button[id="Availability & Trends-dropdown"]')
                .waitForElementVisible('ul[id="Availability & Trends-dropdown--container"]')
                .click('ul[id="Availability & Trends-dropdown--container"] li:nth-of-type(3) a')
                .assert.urlContains(`${links[2]}`, `Params: url is ${links[2]}`)
                .waitForElementNotPresent('.LoadingOverlay__ul', 60000)

                .click('button[id="Availability & Trends-dropdown"]')
                .waitForElementVisible('ul[id="Availability & Trends-dropdown--container"]')
                .click('ul[id="Availability & Trends-dropdown--container"] li:nth-of-type(4) a')
                .assert.urlContains(`${links[3]}`, `Params: url is ${links[3]}`)
                .waitForElementNotPresent('.LoadingOverlay__ul', 60000)

                .click('button[id="Platform Health & Resiliency-dropdown"]')
                .waitForElementVisible('ul[id="Platform Health & Resiliency-dropdown--container"]')
                .click('ul[id="Platform Health & Resiliency-dropdown--container"] a')
                .assert.urlContains(`${links[4]}`, `Params: url is ${links[4]}`)
                .waitForElementNotPresent('.LoadingOverlay__ul', 60000)

                .click('button[id="Platform Health & Resiliency-dropdown"]')
                .waitForElementVisible('ul[id="Platform Health & Resiliency-dropdown--container"]')
                .click('ul[id="Platform Health & Resiliency-dropdown--container"] li:nth-of-type(2) a')
                .assert.urlContains(`${links[5]}`, `Params: url is ${links[5]}`)
                .waitForElementNotPresent('.LoadingOverlay__ul', 60000)

                .click('button[id="Platform Health & Resiliency-dropdown"]')
                .waitForElementVisible('ul[id="Platform Health & Resiliency-dropdown--container"]')
                .click('ul[id="Platform Health & Resiliency-dropdown--container"] li:nth-of-type(3) a')
                .assert.urlContains('prb', `Params: url is ${links[6]}`)
                .waitForElementNotPresent('.LoadingOverlay__ul', 60000)

                .click('button[id="Platform Health & Resiliency-dropdown"]')
                .waitForElementVisible('ul[id="Platform Health & Resiliency-dropdown--container"]')
                .click('ul[id="Platform Health & Resiliency-dropdown--container"] li:nth-of-type(4) a')
                .assert.urlContains(`${links[7]}`, `Params: url is ${links[7]}`)
                .waitForElementNotPresent('.LoadingOverlay__ul', 60000)

                .click('button[id="Outage Report-dropdown"]')
                .waitForElementVisible('ul[id="Outage Report-dropdown--container"]')
                .click('ul[id="Outage Report-dropdown--container"] a')
                .assert.urlContains(`${links[8]}`, `Params: url is ${links[8]}`)
                .waitForElementNotPresent('.LoadingOverlay__ul', 60000)

                .url('https://opxhub-ui.us-west-2.test.expedia.com/home?selectedBrand=Expedia%20Group')
                .waitForElementVisible('body');
        } else if (links.length === 13) {
            await client
                .click('button[id="Availability & Trends-dropdown"]')
                .waitForElementVisible('ul[id="Availability & Trends-dropdown--container"]')
                .click('ul[id="Availability & Trends-dropdown--container"] a')
                .assert.urlContains(`${links[0]}`, `Params: url is ${links[0]}`)
                .waitForElementNotPresent('.LoadingOverlay__ul', 60000)

                .click('button[id="Availability & Trends-dropdown"]')
                .waitForElementVisible('ul[id="Availability & Trends-dropdown--container"]')
                .click('ul[id="Availability & Trends-dropdown--container"] li:nth-of-type(2) a')
                .assert.urlContains(`${links[1]}`, `Params: url is ${links[1]}`)
                .waitForElementNotPresent('.LoadingOverlay__ul', 60000)

                .click('button[id="Availability & Trends-dropdown"]')
                .waitForElementVisible('ul[id="Availability & Trends-dropdown--container"]')
                .click('ul[id="Availability & Trends-dropdown--container"] li:nth-of-type(3) a')
                .assert.urlContains(`${links[2]}`, `Params: url is ${links[2]}`)
                .waitForElementNotPresent('.LoadingOverlay__ul', 60000)

                .click('button[id="Availability & Trends-dropdown"]')
                .waitForElementVisible('ul[id="Availability & Trends-dropdown--container"]')
                .click('ul[id="Availability & Trends-dropdown--container"] li:nth-of-type(4) a')
                .assert.urlContains(`${links[3]}`, `Params: url is ${links[3]}`)
                .waitForElementNotPresent('.LoadingOverlay__ul', 60000)

                .click('button[id="Availability & Trends-dropdown"]')
                .waitForElementVisible('ul[id="Availability & Trends-dropdown--container"]')
                .click('ul[id="Availability & Trends-dropdown--container"] li:nth-of-type(5) a')
                .assert.urlContains(`${links[4]}`, `Params: url is ${links[4]}`)
                .waitForElementNotPresent('.LoadingOverlay__ul', 60000)

                .click('button[id="Availability & Trends-dropdown"]')
                .waitForElementVisible('ul[id="Availability & Trends-dropdown--container"]')
                .click('ul[id="Availability & Trends-dropdown--container"] li:nth-of-type(6) a')
                .assert.urlContains(`${links[5]}`, `Params: url is ${links[5]}`)
                .waitForElementNotPresent('.LoadingOverlay__ul', 60000)

                .click('button[id="Availability & Trends-dropdown"]')
                .waitForElementVisible('ul[id="Availability & Trends-dropdown--container"]')
                .click('ul[id="Availability & Trends-dropdown--container"] li:nth-of-type(7) a')
                .assert.urlContains(`${links[6]}`, `Params: url is ${links[6]}`)
                .waitForElementNotPresent('.LoadingOverlay__ul', 60000)

                .click('button[id="Platform Health & Resiliency-dropdown"]')
                .waitForElementVisible('ul[id="Platform Health & Resiliency-dropdown--container"]')
                .click('ul[id="Platform Health & Resiliency-dropdown--container"] a')
                .assert.urlContains(`${links[7]}`, `Params: url is ${links[7]}`)
                .waitForElementNotPresent('.LoadingOverlay__ul', 60000)

                .click('button[id="Platform Health & Resiliency-dropdown"]')
                .waitForElementVisible('ul[id="Platform Health & Resiliency-dropdown--container"]')
                .click('ul[id="Platform Health & Resiliency-dropdown--container"] li:nth-of-type(2) a')
                .assert.urlContains(`${links[8]}`, `Params: url is ${links[8]}`)
                .waitForElementNotPresent('.LoadingOverlay__ul', 60000)

                .click('button[id="Platform Health & Resiliency-dropdown"]')
                .waitForElementVisible('ul[id="Platform Health & Resiliency-dropdown--container"]')
                .click('ul[id="Platform Health & Resiliency-dropdown--container"] li:nth-of-type(3) a')
                .assert.urlContains(`${links[9]}`, `Params: url is ${links[9]}`)
                .waitForElementNotPresent('.LoadingOverlay__ul', 60000)

                .click('button[id="Platform Health & Resiliency-dropdown"]')
                .waitForElementVisible('ul[id="Platform Health & Resiliency-dropdown--container"]')
                .click('ul[id="Platform Health & Resiliency-dropdown--container"] li:nth-of-type(4) a')
                .assert.urlContains('prb', `Params: url is ${links[10]}`)
                .waitForElementNotPresent('.LoadingOverlay__ul', 60000)

                .click('button[id="Platform Health & Resiliency-dropdown"]')
                .waitForElementVisible('ul[id="Platform Health & Resiliency-dropdown--container"]')
                .click('ul[id="Platform Health & Resiliency-dropdown--container"] li:nth-of-type(5) a')
                .assert.urlContains(`${links[11]}`, `Params: url is ${links[11]}`)
                .waitForElementNotPresent('.LoadingOverlay__ul', 60000)

                .click('button[id="Outage Report-dropdown"]')
                .waitForElementVisible('ul[id="Outage Report-dropdown--container"]')
                .click('ul[id="Outage Report-dropdown--container"] a')
                .assert.urlContains(`${links[12]}`, `Params: url is ${links[12]}`)
                .waitForElementNotPresent('.LoadingOverlay__ul', 60000)

                .url('https://opxhub-ui.us-west-2.test.expedia.com/home?selectedBrand=Expedia%20Group')
                .waitForElementVisible('body');
        }
    },

    setLinks: async (client, links) => {
        links = [];
        await client
            .elements('css selector', '.home-buttons-container a', (elements) => {
                elements.value.forEach((elementsObj) => {
                    client.elementIdAttribute(elementsObj[Object.keys(elementsObj)], 'href', (result) => {
                        links.push(result.value);
                    });
                });
            });
        return links;
    },

    setBrands: async (client) => {
        const brands = [];
        await client
            .url('https://opxhub-ui.us-west-2.test.expedia.com/home?selectedBrand=Expedia%20Group')
            .waitForElementVisible('body', 1000)
            .elements('css selector', '#brand-selector--container li', (elements) => {
                elements.value.forEach((elementsObj) => {
                    client.elementIdAttribute(elementsObj[Object.keys(elementsObj)], 'textContent', (result) => {
                        let text = result.value.includes('Retail') ? result.value.slice(0, -7) : result.value;

                        brands.push({
                            url: encodeURIComponent(text),
                            text
                        });
                    });
                });
            });
        return brands;
    },

    selectFilters: async (client, brands, id) => {
        await client
            .click('#brand-selector')
            .waitForElementVisible('#brand-selector--container.Dropdown__menu--right')
            .click(`.Dropdown__menu--open li:nth-child(${id})`)
            .assert.urlContains(`selectedBrand=${brands[id - 1].url}`, `Params: Brand is ${brands[id - 1].text}`);
    }
};
