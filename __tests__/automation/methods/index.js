export * from './common-method';
// module.exports = {
//     checkRoutes: async (browser, links, brands, id) => {
//         if (links.length === 6) {
//             await browser.click('button[id="Availability & Trends-dropdown"]');
//             await browser.expect.element('ul[id="Availability & Trends-dropdown--container"]').to.be.visible.before(1000);
//             await browser.click('ul[id="Availability & Trends-dropdown--container"] a');
//             await browser.assert.urlContains(`${links[0]}`, `Params: url is ${links[0]}`);
//
//             await browser.click('button[id="Platform Health & Resiliency-dropdown"]');
//             await browser.expect.element('ul[id="Platform Health & Resiliency-dropdown--container"]').to.be.visible.before(1000);
//             await browser.click('ul[id="Platform Health & Resiliency-dropdown--container"] a');
//             await browser.assert.urlContains(`${links[1]}`, `Params: url is ${links[1]}`);
//
//             await browser.click('button[id="Platform Health & Resiliency-dropdown"]');
//             await browser.expect.element('ul[id="Platform Health & Resiliency-dropdown--container"]').to.be.visible.before(1000);
//             await browser.click('ul[id="Platform Health & Resiliency-dropdown--container"] li:nth-of-type(2) a');
//             await browser.assert.urlContains(`${links[2]}`, `Params: url is ${links[2]}`);
//
//             await browser.click('button[id="Platform Health & Resiliency-dropdown"]');
//             await browser.expect.element('ul[id="Platform Health & Resiliency-dropdown--container"]').to.be.visible.before(1000);
//             await browser.click('ul[id="Platform Health & Resiliency-dropdown--container"] li:nth-of-type(3) a');
//             await browser.assert.urlContains('prb', `Params: url is ${links[3]}`);
//
//             await browser.click('button[id="Platform Health & Resiliency-dropdown"]');
//             await browser.expect.element('ul[id="Platform Health & Resiliency-dropdown--container"]').to.be.visible.before(1000);
//             await browser.click('ul[id="Platform Health & Resiliency-dropdown--container"] li:nth-of-type(4) a');
//             await browser.assert.urlContains(`${links[4]}`, `Params: url is ${links[4]}`);
//
//             await browser.click('button[id="Outage Report-dropdown"]');
//             await browser.expect.element('ul[id="Outage Report-dropdown--container"]').to.be.visible.before(1000);
//             await browser.click('ul[id="Outage Report-dropdown--container"] a');
//             await browser.assert.urlContains(`${links[5]}`, `Params: url is ${links[5]}`);
//         } else if (links.length === 8) {
//             await browser.click('button[id="Availability & Trends-dropdown"]');
//             await browser.expect.element('ul[id="Availability & Trends-dropdown--container"]');
//             await browser.click('ul[id="Availability & Trends-dropdown--container"] a');
//             await browser.assert.urlContains(`${links[0]}`, `Params: url is ${links[0]}`);
//
//             await browser.click('button[id="Availability & Trends-dropdown"]');
//             await browser.expect.element('ul[id="Availability & Trends-dropdown--container"]');
//             await browser.click('ul[id="Availability & Trends-dropdown--container"] li:nth-of-type(2) a');
//             await browser.assert.urlContains(`${links[1]}`, `Params: url is ${links[1]}`);
//
//             await browser.click('button[id="Availability & Trends-dropdown"]');
//             await browser.expect.element('ul[id="Availability & Trends-dropdown--container"]');
//             await browser.click('ul[id="Availability & Trends-dropdown--container"] li:nth-of-type(3) a');
//             await browser.assert.urlContains(`${links[2]}`, `Params: url is ${links[2]}`);
//
//             await browser.click('button[id="Platform Health & Resiliency-dropdown"]');
//             await browser.expect.element('ul[id="Platform Health & Resiliency-dropdown--container"]');
//             await browser.click('ul[id="Platform Health & Resiliency-dropdown--container"] a');
//             await browser.assert.urlContains(`${links[3]}`, `Params: url is ${links[3]}`);
//
//             await browser.click('button[id="Platform Health & Resiliency-dropdown"]');
//             await browser.expect.element('ul[id="Platform Health & Resiliency-dropdown--container"]');
//             await browser.click('ul[id="Platform Health & Resiliency-dropdown--container"] li:nth-of-type(2) a');
//             await browser.assert.urlContains(`${links[4]}`, `Params: url is ${links[4]}`);
//
//             await browser.click('button[id="Platform Health & Resiliency-dropdown"]');
//             await browser.expect.element('ul[id="Platform Health & Resiliency-dropdown--container"]');
//             await browser.click('ul[id="Platform Health & Resiliency-dropdown--container"] li:nth-of-type(3) a');
//             await browser.assert.urlContains('prb', `Params: url is ${links[5]}`);
//
//             await browser.click('button[id="Platform Health & Resiliency-dropdown"]');
//             await browser.expect.element('ul[id="Platform Health & Resiliency-dropdown--container"]');
//             await browser.click('ul[id="Platform Health & Resiliency-dropdown--container"] li:nth-of-type(4) a');
//             await browser.assert.urlContains(`${links[6]}`, `Params: url is ${links[6]}`);
//
//             await browser.click('button[id="Outage Report-dropdown"]');
//             await browser.expect.element('ul[id="Outage Report-dropdown--container"]');
//             await browser.click('ul[id="Outage Report-dropdown--container"] a');
//             await browser.assert.urlContains(`${links[7]}`, `Params: url is ${links[7]}`);
//         } else if (links.length === 9) {
//             await browser.click('button[id="Availability & Trends-dropdown"]');
//             await browser.expect.element('ul[id="Availability & Trends-dropdown--container"]');
//             await browser.click('ul[id="Availability & Trends-dropdown--container"] a');
//             await browser.assert.urlContains(`${links[0]}`, `Params: url is ${links[0]}`);
//
//             await browser.click('button[id="Availability & Trends-dropdown"]');
//             await browser.expect.element('ul[id="Availability & Trends-dropdown--container"]');
//             await browser.click('ul[id="Availability & Trends-dropdown--container"] li:nth-of-type(2) a');
//             await browser.assert.urlContains(`${links[1]}`, `Params: url is ${links[1]}`);
//
//             await browser.click('button[id="Availability & Trends-dropdown"]');
//             await browser.expect.element('ul[id="Availability & Trends-dropdown--container"]');
//             await browser.click('ul[id="Availability & Trends-dropdown--container"] li:nth-of-type(3) a');
//             await browser.assert.urlContains(`${links[2]}`, `Params: url is ${links[2]}`);
//
//             await browser.click('button[id="Availability & Trends-dropdown"]');
//             await browser.expect.element('ul[id="Availability & Trends-dropdown--container"]');
//             await browser.click('ul[id="Availability & Trends-dropdown--container"] li:nth-of-type(4) a');
//             await browser.assert.urlContains(`${links[3]}`, `Params: url is ${links[3]}`);
//
//             await browser.click('button[id="Platform Health & Resiliency-dropdown"]');
//             await browser.expect.element('ul[id="Platform Health & Resiliency-dropdown--container"]');
//             await browser.click('ul[id="Platform Health & Resiliency-dropdown--container"] a');
//             await browser.assert.urlContains(`${links[4]}`, `Params: url is ${links[4]}`);
//
//             await browser.click('button[id="Platform Health & Resiliency-dropdown"]');
//             await browser.expect.element('ul[id="Platform Health & Resiliency-dropdown--container"]');
//             await browser.click('ul[id="Platform Health & Resiliency-dropdown--container"] li:nth-of-type(2) a');
//             await browser.assert.urlContains(`${links[5]}`, `Params: url is ${links[5]}`);
//
//             await browser.click('button[id="Platform Health & Resiliency-dropdown"]');
//             await browser.expect.element('ul[id="Platform Health & Resiliency-dropdown--container"]');
//             await browser.click('ul[id="Platform Health & Resiliency-dropdown--container"] li:nth-of-type(3) a');
//             await browser.assert.urlContains('prb', `Params: url is ${links[6]}`);
//
//             await browser.click('button[id="Platform Health & Resiliency-dropdown"]');
//             await browser.expect.element('ul[id="Platform Health & Resiliency-dropdown--container"]');
//             await browser.click('ul[id="Platform Health & Resiliency-dropdown--container"] li:nth-of-type(4) a');
//             await browser.assert.urlContains(`${links[7]}`, `Params: url is ${links[7]}`);
//
//             await browser.click('button[id="Outage Report-dropdown"]');
//             await browser.expect.element('ul[id="Outage Report-dropdown--container"]');
//             await browser.click('ul[id="Outage Report-dropdown--container"] a');
//             await browser.assert.urlContains(`${links[8]}`, `Params: url is ${links[8]}`);
//         } else if (links.length === 13) {
//             await browser.click('button[id="Availability & Trends-dropdown"]');
//             await browser.expect.element('ul[id="Availability & Trends-dropdown--container"]');
//             await browser.click('ul[id="Availability & Trends-dropdown--container"] a');
//             await browser.assert.urlContains(`${links[0]}`, `Params: url is ${links[0]}`);
//
//             await browser.click('button[id="Availability & Trends-dropdown"]');
//             await browser.expect.element('ul[id="Availability & Trends-dropdown--container"]');
//             await browser.click('ul[id="Availability & Trends-dropdown--container"] li:nth-of-type(2) a');
//             await browser.assert.urlContains(`${links[1]}`, `Params: url is ${links[1]}`);
//
//             await browser.click('button[id="Availability & Trends-dropdown"]');
//             await browser.expect.element('ul[id="Availability & Trends-dropdown--container"]');
//             await browser.click('ul[id="Availability & Trends-dropdown--container"] li:nth-of-type(3) a');
//             await browser.assert.urlContains(`${links[2]}`, `Params: url is ${links[2]}`);
//
//             await browser.click('button[id="Availability & Trends-dropdown"]');
//             await browser.expect.element('ul[id="Availability & Trends-dropdown--container"]');
//             await browser.click('ul[id="Availability & Trends-dropdown--container"] li:nth-of-type(4) a');
//             await browser.assert.urlContains(`${links[3]}`, `Params: url is ${links[3]}`);
//
//             await browser.click('button[id="Availability & Trends-dropdown"]');
//             await browser.expect.element('ul[id="Availability & Trends-dropdown--container"]');
//             await browser.click('ul[id="Availability & Trends-dropdown--container"] li:nth-of-type(5) a');
//             await browser.assert.urlContains(`${links[4]}`, `Params: url is ${links[4]}`);
//
//             await browser.click('button[id="Availability & Trends-dropdown"]');
//             await browser.expect.element('ul[id="Availability & Trends-dropdown--container"]');
//             await browser.click('ul[id="Availability & Trends-dropdown--container"] li:nth-of-type(6) a');
//             await browser.assert.urlContains(`${links[5]}`, `Params: url is ${links[5]}`);
//
//             await browser.click('button[id="Availability & Trends-dropdown"]');
//             await browser.expect.element('ul[id="Availability & Trends-dropdown--container"]');
//             await browser.click('ul[id="Availability & Trends-dropdown--container"] li:nth-of-type(7) a');
//             await browser.assert.urlContains(`${links[6]}`, `Params: url is ${links[6]}`);
//
//             await browser.click('button[id="Platform Health & Resiliency-dropdown"]');
//             await browser.expect.element('ul[id="Platform Health & Resiliency-dropdown--container"]');
//             await browser.click('ul[id="Platform Health & Resiliency-dropdown--container"] a');
//             await browser.assert.urlContains(`${links[7]}`, `Params: url is ${links[7]}`);
//
//             await browser.click('button[id="Platform Health & Resiliency-dropdown"]');
//             await browser.expect.element('ul[id="Platform Health & Resiliency-dropdown--container"]');
//             await browser.click('ul[id="Platform Health & Resiliency-dropdown--container"] li:nth-of-type(2) a');
//             await browser.assert.urlContains(`${links[8]}`, `Params: url is ${links[8]}`);
//
//             await browser.click('button[id="Platform Health & Resiliency-dropdown"]');
//             await browser.expect.element('ul[id="Platform Health & Resiliency-dropdown--container"]');
//             await browser.click('ul[id="Platform Health & Resiliency-dropdown--container"] li:nth-of-type(3) a');
//             await browser.assert.urlContains(`${links[9]}`, `Params: url is ${links[9]}`);
//
//             await browser.click('button[id="Platform Health & Resiliency-dropdown"]');
//             await browser.expect.element('ul[id="Platform Health & Resiliency-dropdown--container"]');
//             await browser.click('ul[id="Platform Health & Resiliency-dropdown--container"] li:nth-of-type(4) a');
//             await browser.assert.urlContains('prb', `Params: url is ${links[10]}`);
//
//             await browser.click('button[id="Platform Health & Resiliency-dropdown"]');
//             await browser.expect.element('ul[id="Platform Health & Resiliency-dropdown--container"]');
//             await browser.click('ul[id="Platform Health & Resiliency-dropdown--container"] li:nth-of-type(5) a');
//             await browser.assert.urlContains(`${links[11]}`, `Params: url is ${links[11]}`);
//
//             await browser.click('button[id="Outage Report-dropdown"]');
//             await browser.expect.element('ul[id="Outage Report-dropdown--container"]');
//             await browser.click('ul[id="Outage Report-dropdown--container"] a');
//             await browser.assert.urlContains(`${links[12]}`, `Params: url is ${links[12]}`);
//         }
//
//         await browser.click('#brand-selector');
//         await browser.expect.element('#brand-selector--container').to.be.visible.before(1000);
//         await browser.click(`#brand-selector--container li:nth-child(${Number(id) + 1})`);
//         await browser.assert.urlContains(`selectedBrand=${brands[id].url}`, `Params: Brand is ${brands[id].text}`);
//     },
//
//     navToHomepage: async (browser) => {
//         await browser
//             .url('https://opxhub-ui.us-west-2.test.expedia.com/home?selectedBrand=Expedia%20Group')
//             .waitForElementVisible('body', 1000);
//     },
//
//     setLinks: async (client, links) => {
//         links = [];
//         await client
//             .elements('css selector', '.category-dropdown-item', (elements) => {
//                 elements.value.forEach((elementsObj) => {
//                     client.elementIdAttribute(elementsObj[Object.keys(elementsObj)], 'href', (result) => {
//                         links.push(result.value);
//                     });
//                 });
//             });
//         return links;
//     },
//
//     setBrands: async (client) => {
//         const brands = [];
//         await client
//             .url('https://opxhub-ui.us-west-2.test.expedia.com/home?selectedBrand=Expedia%20Group')
//             .waitForElementVisible('body', 1000)
//             .elements('css selector', '#brand-selector--container li', (elements) => {
//                 elements.value.forEach((elementsObj) => {
//                     client.elementIdAttribute(elementsObj[Object.keys(elementsObj)], 'textContent', (result) => {
//                         let text = result.value.includes('Retail') ? result.value.slice(0, -7) : result.value;
//
//                         brands.push({
//                             url: encodeURIComponent(text),
//                             text
//                         });
//                     });
//                 });
//             });
//         return brands;
//     },
//
//     // selectFilters: async (browser, brands, id) => {
//     //     await browser.click('#brand-selector');
//     //     await browser.expect.element('#brand-selector--container').to.be.visible.before(1000);
//     //     await browser.click(`#brand-selector--container li:nth-child(${id + 1})`);
//     //     await browser.assert.urlContains(`selectedBrand=${brands[id].url}`, `Params: Brand is ${brands[id].text}`);
//     // }
// };
