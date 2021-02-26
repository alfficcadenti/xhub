module.exports = {
    'First test case'(browser) {
        browser
            .url('http://localhost:8080/impulse?selectedBrand=Expedia')
            .waitForElementVisible('.page-title')
            .assert.containsText('.page-title', 'Impulse Dashboard');
    }
};
