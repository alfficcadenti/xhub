import { BeforeAll, AfterAll, After, setDefaultTimeout } from 'cucumber';
import { createSession, closeSession, startWebDriver, stopWebDriver, getNewScreenshots } from 'nightwatch-api';
import { saveConsoleInfo } from '../utils/helpers';
import { GLOBAL_TIMEOUT } from '../utils/consts';
const fs = require('fs');

setDefaultTimeout(GLOBAL_TIMEOUT);

BeforeAll(async () => {
  process.env.defaultOpenWindow = '';

  await startWebDriver({
    env: process.env.TEST_BROWSER
  });

  await createSession();

  const consoleInfo = console.info;
  console.info = function (...info) {
    if (!info.length) {
      return;
    }
    consoleInfo.apply(this, info);
    saveConsoleInfo(info);
  };
});

After(function () {
  getNewScreenshots().forEach(file => this.attach(fs.readFileSync(file), 'image/png'));
});

AfterAll(async () => {
  if (process.env.DEBUG_MODE === 'true') {
    return;
  }

  if (process.env.isBrowserstack) {
    const browserstack = require('browserstack-local');
    const bsLocal = new browserstack.Local();

    if (bsLocal.isRunning()) {
      bsLocal.stop(() => {
        console.log('[info:After All] BS local stopped');
      });
    }
  }

  await closeSession();
  await stopWebDriver();
});
