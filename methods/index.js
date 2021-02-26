module.exports = {
    setNav: async (client, links, switchOrder = false) => {
        if (links.length === 6) {
            await client
                .pause(3000)
                .click('button[id="Availability & Trends-dropdown"]')
                .pause(1000)
                .waitForElementVisible('ul[id="Availability & Trends-dropdown--container"]', 20000)
                .click('ul[id="Availability & Trends-dropdown--container"] a')
                .assert.urlContains(`${links[0]}`, `Params: url is ${links[0]}`)
                .waitForElementNotPresent('.LoadingOverlay__ul', 60000)

                .click('button[id="Platform Health & Resiliency-dropdown"]')
                .pause(1000)
                .waitForElementVisible('ul[id="Platform Health & Resiliency-dropdown--container"]')
                .click('ul[id="Platform Health & Resiliency-dropdown--container"] a')
                .assert.urlContains(`${links[1]}`, `Params: url is ${links[1]}`)
                .waitForElementNotPresent('.LoadingOverlay__ul', 60000)

                .click('button[id="Platform Health & Resiliency-dropdown"]')
                .pause(1000)
                .waitForElementVisible('ul[id="Platform Health & Resiliency-dropdown--container"]')
                .click('ul[id="Platform Health & Resiliency-dropdown--container"] li:nth-of-type(2) a')
                .assert.urlContains(`${links[2]}`, `Params: url is ${links[2]}`)
                .waitForElementNotPresent('.LoadingOverlay__ul', 60000)

                .click('button[id="Platform Health & Resiliency-dropdown"]')
                .pause(1000)
                .waitForElementVisible('ul[id="Platform Health & Resiliency-dropdown--container"]')
                .click('ul[id="Platform Health & Resiliency-dropdown--container"] li:nth-of-type(3) a')
                .assert.urlContains('prb', `Params: url is ${links[3]}`)
                .waitForElementNotPresent('.LoadingOverlay__ul', 60000)

                .click('button[id="Platform Health & Resiliency-dropdown"]')
                .pause(1000)
                .waitForElementVisible('ul[id="Platform Health & Resiliency-dropdown--container"]')
                .click('ul[id="Platform Health & Resiliency-dropdown--container"] li:nth-of-type(4) a')
                .assert.urlContains(`${links[4]}`, `Params: url is ${links[4]}`)
                .waitForElementNotPresent('.LoadingOverlay__ul', 60000)

                .click('button[id="Outage Report-dropdown"]')
                .pause(1000)
                .click('ul[id="Outage Report-dropdown--container"] a')
                .assert.urlContains(`${links[5]}`, `Params: url is ${links[5]}`)
                .waitForElementNotPresent('.LoadingOverlay__ul', 60000)

                .url('http://localhost:8080/home?selectedBrand=Expedia%20Group')
                .waitForElementVisible('body');
        } else if (links.length === 8) {
            client
                .pause(3000)
                .click('button[id="Availability & Trends-dropdown"]')
                .pause(1000)
                .waitForElementVisible('ul[id="Availability & Trends-dropdown--container"]', 20000)
                .click('ul[id="Availability & Trends-dropdown--container"] a')
                .assert.urlContains(`${links[0]}`, `Params: url is ${links[0]}`)
                .waitForElementNotPresent('.LoadingOverlay__ul', 60000)

                .click('button[id="Availability & Trends-dropdown"]')
                .pause(1000)
                .waitForElementVisible('ul[id="Availability & Trends-dropdown--container"]')
                .click('ul[id="Availability & Trends-dropdown--container"] li:nth-of-type(2) a')
                .assert.urlContains(`${links[1]}`, `Params: url is ${links[1]}`)
                .waitForElementNotPresent('.LoadingOverlay__ul', 60000)

                .click('button[id="Availability & Trends-dropdown"]')
                .pause(1000)
                .waitForElementVisible('ul[id="Availability & Trends-dropdown--container"]')
                .click('ul[id="Availability & Trends-dropdown--container"] li:nth-of-type(3) a')
                .assert.urlContains(`${links[2]}`, `Params: url is ${links[2]}`)
                .waitForElementNotPresent('.LoadingOverlay__ul', 60000)

                .click('button[id="Platform Health & Resiliency-dropdown"]')
                .pause(1000)
                .waitForElementVisible('ul[id="Platform Health & Resiliency-dropdown--container"]')
                .click('ul[id="Platform Health & Resiliency-dropdown--container"] a')
                .assert.urlContains(`${links[3]}`, `Params: url is ${links[3]}`)
                .waitForElementNotPresent('.LoadingOverlay__ul', 60000)

                .click('button[id="Platform Health & Resiliency-dropdown"]')
                .pause(1000)
                .waitForElementVisible('ul[id="Platform Health & Resiliency-dropdown--container"]')
                .click('ul[id="Platform Health & Resiliency-dropdown--container"] li:nth-of-type(2) a')
                .assert.urlContains(`${links[4]}`, `Params: url is ${links[4]}`)
                .waitForElementNotPresent('.LoadingOverlay__ul', 60000)

                .click('button[id="Platform Health & Resiliency-dropdown"]')
                .pause(1000)
                .waitForElementVisible('ul[id="Platform Health & Resiliency-dropdown--container"]')
                .click('ul[id="Platform Health & Resiliency-dropdown--container"] li:nth-of-type(3) a')
                .assert.urlContains('prb', `Params: url is ${links[5]}`)
                .waitForElementNotPresent('.LoadingOverlay__ul', 60000)

                .click('button[id="Platform Health & Resiliency-dropdown"]')
                .pause(1000)
                .waitForElementVisible('ul[id="Platform Health & Resiliency-dropdown--container"]')
                .click('ul[id="Platform Health & Resiliency-dropdown--container"] li:nth-of-type(4) a')
                .assert.urlContains(`${links[6]}`, `Params: url is ${links[6]}`)
                .waitForElementNotPresent('.LoadingOverlay__ul', 60000)

                .click('button[id="Outage Report-dropdown"]')
                .pause(1000)
                .waitForElementVisible('ul[id="Outage Report-dropdown--container"]')
                .click('ul[id="Outage Report-dropdown--container"] a')
                .assert.urlContains(`${links[7]}`, `Params: url is ${links[7]}`)
                .waitForElementNotPresent('.LoadingOverlay__ul', 60000)

                .url('http://localhost:8080/home?selectedBrand=Expedia%20Group')
                .waitForElementVisible('body');
        } else if (links.length === 9) {
            if (switchOrder) {
                await client
                    .pause(3000)
                    .click('button[id="Availability & Trends-dropdown"]')
                    .pause(1000)
                    .waitForElementVisible('ul[id="Availability & Trends-dropdown--container"]', 20000)
                    .click('ul[id="Availability & Trends-dropdown--container"] li:nth-of-type(1) a')
                    .assert.urlContains(`${links[0]}`, `Params: url is ${links[0]}`)
                    .waitForElementNotPresent('.LoadingOverlay__ul', 60000)

                    .click('button[id="Availability & Trends-dropdown"]')
                    .pause(1000)
                    .waitForElementVisible('ul[id="Availability & Trends-dropdown--container"]')
                    .click('ul[id="Availability & Trends-dropdown--container"] li:nth-of-type(2) a')
                    .assert.urlContains(`${links[1]}`, `Params: url is ${links[1]}`)
                    .waitForElementNotPresent('.LoadingOverlay__ul', 60000)

                    .click('button[id="Availability & Trends-dropdown"]')
                    .pause(1000)
                    .waitForElementVisible('ul[id="Availability & Trends-dropdown--container"]')
                    .click('ul[id="Availability & Trends-dropdown--container"] li:nth-of-type(3) a')
                    .assert.urlContains(`${links[2]}`, `Params: url is ${links[2]}`)
                    .waitForElementNotPresent('.LoadingOverlay__ul', 60000)

                    .click('button[id="Platform Health & Resiliency-dropdown"]')
                    .pause(1000)
                    .waitForElementVisible('ul[id="Platform Health & Resiliency-dropdown--container"]')
                    .click('ul[id="Platform Health & Resiliency-dropdown--container"] li:nth-of-type(1) a')
                    .assert.urlContains(`${links[3]}`, `Params: url is ${links[3]}`)
                    .waitForElementNotPresent('.LoadingOverlay__ul', 60000)

                    .click('button[id="Platform Health & Resiliency-dropdown"]')
                    .pause(1000)
                    .waitForElementVisible('ul[id="Platform Health & Resiliency-dropdown--container"]')
                    .click('ul[id="Platform Health & Resiliency-dropdown--container"] li:nth-of-type(2) a')
                    .assert.urlContains(`${links[4]}`, `Params: url is ${links[4]}`)
                    .waitForElementNotPresent('.LoadingOverlay__ul', 60000)

                    .click('button[id="Platform Health & Resiliency-dropdown"]')
                    .pause(1000)
                    .waitForElementVisible('ul[id="Platform Health & Resiliency-dropdown--container"]')
                    .click('ul[id="Platform Health & Resiliency-dropdown--container"] li:nth-of-type(3) a')
                    .assert.urlContains(`${links[5]}`, `Params: url is ${links[5]}`)
                    .waitForElementNotPresent('.LoadingOverlay__ul', 60000)

                    .click('button[id="Platform Health & Resiliency-dropdown"]')
                    .pause(1000)
                    .waitForElementVisible('ul[id="Platform Health & Resiliency-dropdown--container"]')
                    .click('ul[id="Platform Health & Resiliency-dropdown--container"] li:nth-of-type(4) a')
                    .assert.urlContains('prb', `Params: url is ${links[6]}`)
                    .waitForElementNotPresent('.LoadingOverlay__ul', 60000)

                    .click('button[id="Platform Health & Resiliency-dropdown"]')
                    .pause(1000)
                    .waitForElementVisible('ul[id="Platform Health & Resiliency-dropdown--container"]')
                    .click('ul[id="Platform Health & Resiliency-dropdown--container"] li:nth-of-type(5) a')
                    .assert.urlContains(`${links[7]}`, `Params: url is ${links[7]}`)
                    .waitForElementNotPresent('.LoadingOverlay__ul', 60000)

                    .click('button[id="Outage Report-dropdown"]')
                    .pause(1000)
                    .waitForElementVisible('ul[id="Outage Report-dropdown--container"]')
                    .click('ul[id="Outage Report-dropdown--container"] a')
                    .assert.urlContains(`${links[8]}`, `Params: url is ${links[8]}`)
                    .waitForElementNotPresent('.LoadingOverlay__ul', 60000)

                    .url('http://localhost:8080/home?selectedBrand=Expedia%20Group')
                    .waitForElementVisible('body');
            } else {
                await client
                    .pause(3000)
                    .click('button[id="Availability & Trends-dropdown"]')
                    .pause(1000)
                    .waitForElementVisible('ul[id="Availability & Trends-dropdown--container"]', 20000)
                    .click('ul[id="Availability & Trends-dropdown--container"] a')
                    .assert.urlContains(`${links[0]}`, `Params: url is ${links[0]}`)
                    .waitForElementNotPresent('.LoadingOverlay__ul', 60000)

                    .click('button[id="Availability & Trends-dropdown"]')
                    .pause(1000)
                    .waitForElementVisible('ul[id="Availability & Trends-dropdown--container"]')
                    .click('ul[id="Availability & Trends-dropdown--container"] li:nth-of-type(2) a')
                    .assert.urlContains(`${links[1]}`, `Params: url is ${links[1]}`)
                    .waitForElementNotPresent('.LoadingOverlay__ul', 60000)

                    .click('button[id="Availability & Trends-dropdown"]')
                    .pause(1000)
                    .waitForElementVisible('ul[id="Availability & Trends-dropdown--container"]')
                    .click('ul[id="Availability & Trends-dropdown--container"] li:nth-of-type(3) a')
                    .assert.urlContains(`${links[2]}`, `Params: url is ${links[2]}`)
                    .waitForElementNotPresent('.LoadingOverlay__ul', 60000)

                    .click('button[id="Availability & Trends-dropdown"]')
                    .pause(1000)
                    .waitForElementVisible('ul[id="Availability & Trends-dropdown--container"]')
                    .click('ul[id="Availability & Trends-dropdown--container"] li:nth-of-type(4) a')
                    .assert.urlContains(`${links[3]}`, `Params: url is ${links[3]}`)
                    .waitForElementNotPresent('.LoadingOverlay__ul', 60000)

                    .click('button[id="Platform Health & Resiliency-dropdown"]')
                    .pause(1000)
                    .waitForElementVisible('ul[id="Platform Health & Resiliency-dropdown--container"]')
                    .click('ul[id="Platform Health & Resiliency-dropdown--container"] a')
                    .assert.urlContains(`${links[4]}`, `Params: url is ${links[4]}`)
                    .waitForElementNotPresent('.LoadingOverlay__ul', 60000)

                    .click('button[id="Platform Health & Resiliency-dropdown"]')
                    .pause(1000)
                    .waitForElementVisible('ul[id="Platform Health & Resiliency-dropdown--container"]')
                    .click('ul[id="Platform Health & Resiliency-dropdown--container"] li:nth-of-type(2) a')
                    .assert.urlContains(`${links[5]}`, `Params: url is ${links[5]}`)
                    .waitForElementNotPresent('.LoadingOverlay__ul', 60000)

                    .click('button[id="Platform Health & Resiliency-dropdown"]')
                    .pause(1000)
                    .waitForElementVisible('ul[id="Platform Health & Resiliency-dropdown--container"]')
                    .click('ul[id="Platform Health & Resiliency-dropdown--container"] li:nth-of-type(3) a')
                    .assert.urlContains('prb', `Params: url is ${links[6]}`)
                    .waitForElementNotPresent('.LoadingOverlay__ul', 60000)

                    .click('button[id="Platform Health & Resiliency-dropdown"]')
                    .pause(1000)
                    .waitForElementVisible('ul[id="Platform Health & Resiliency-dropdown--container"]')
                    .click('ul[id="Platform Health & Resiliency-dropdown--container"] li:nth-of-type(4) a')
                    .assert.urlContains(`${links[7]}`, `Params: url is ${links[7]}`)
                    .waitForElementNotPresent('.LoadingOverlay__ul', 60000)

                    .click('button[id="Outage Report-dropdown"]')
                    .pause(1000)
                    .waitForElementVisible('ul[id="Outage Report-dropdown--container"]')
                    .click('ul[id="Outage Report-dropdown--container"] a')
                    .assert.urlContains(`${links[8]}`, `Params: url is ${links[8]}`)
                    .waitForElementNotPresent('.LoadingOverlay__ul', 60000)

                    .url('http://localhost:8080/home?selectedBrand=Expedia%20Group')
                    .waitForElementVisible('body');
            }
        }
    },
    setLinks: async (client, links) => {
        links = [];
        await client
            .elements('css selector', '.home-buttons-container a', (elements) => {
                elements.value.forEach((elementsObj) => {
                    client.elementIdAttribute(elementsObj.ELEMENT, 'href', (result) => {
                        links.push(result.value);
                    });
                });
            });
        return links;
    }
};