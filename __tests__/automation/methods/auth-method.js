export const navigateToOkta = async browser => {
    const url = 'https://expediagroup.okta.com/login/sso_iwa?fromURI=%2Fapp%2FUserHome&redirectFromAdsso=true'
    
    await browser.navigate(url)
}

export const submitForm = async (browser, element) => {
    await browser.click(`${element}`);
}