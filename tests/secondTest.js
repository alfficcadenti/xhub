module.exports = {
    '@tags': ['dropdown'],
    'Dropdown check': async (browser) => {
        const page = browser.page.homepage();

        page
            .navigate()
            .waitForElementVisible('@brandSelector');

        const brands = await browser
            .elements('css selector', '#brand-selector--container li', (elements) => {
                elements.value.forEach((elementsObj) => {
                    const arr = [];
                    browser.elementIdAttribute(elementsObj.ELEMENT, 'textContent', (result) => {
                        arr.push({
                            url: encodeURIComponent(result.value),
                            text: result.value
                        });
                    });
                    return arr;
                });
            });

        page
            .navigate()
            .waitForElementVisible('@brandSelector')
            .selectBrand(1);

        browser.assert.urlContains(`selectedBrand=${brands[0].url}`, `Params: Brand is ${brands[0].text}`);

        page
            .navigate()
            .waitForElementVisible('@brandSelector')
            .selectBrand(2);

        browser.assert.urlContains(`selectedBrand=${brands[1].url}`, `Params: Brand is ${brands[1].text}`);

        page
            .navigate()
            .waitForElementVisible('@brandSelector')
            .selectBrand(3);

        browser.assert.urlContains(`selectedBrand=${brands[2].url}`, `Params: Brand is ${brands[2].text}`);

        page
            .navigate()
            .waitForElementVisible('@brandSelector')
            .selectBrand(4);

        browser.assert.urlContains(`selectedBrand=${brands[3].url}`, `Params: Brand is ${brands[3].text}`);

        page
            .navigate()
            .waitForElementVisible('@brandSelector')
            .selectBrand(5);

        browser.assert.urlContains(`selectedBrand=${brands[4].url}`, `Params: Brand is ${brands[4].text}`);

        page
            .navigate()
            .waitForElementVisible('@brandSelector')
            .selectBrand(6);

        browser.assert.urlContains(`selectedBrand=${brands[5].url}`, `Params: Brand is ${brands[5].text}`);

        browser.saveScreenshot('tests_output/click.png');
    }
};