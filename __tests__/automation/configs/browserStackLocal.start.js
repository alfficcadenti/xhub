const browserstack = require('browserstack-local');
const bsLocal = new browserstack.Local();

const bsConfigs = {
  key: process.env.BROWSERSTACK_KEY,
  localIdentifier: process.env.BROWSERSTACK_LOCAL_IDENTIFIER
};

bsLocal.start(bsConfigs, () => {
  console.info(`key: ${process.env.BROWSERSTACK_KEY}`);
  console.info(`localId: ${process.env.BROWSERSTACK_LOCAL_IDENTIFIER}`);
  console.info('Started BrowserStackLocal');
});
