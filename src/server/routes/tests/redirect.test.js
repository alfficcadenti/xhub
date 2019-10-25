const redirect = require("../redirect");

describe("redirect route", () => {
  it("configuration and redirects", () => {
    expect.assertions(5);

    expect(redirect.path).toEqual('/');
    expect(redirect.method).toEqual('GET');
    expect(redirect.options.id).toEqual('root');
    expect(typeof redirect.options.handler).toEqual('function');

    const h = {redirect(url){
      expect(url).toEqual('/incident-trends');
    }}
    redirect.options.handler(null,h);
  });
});