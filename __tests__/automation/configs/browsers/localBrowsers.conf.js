import { getProxyPort } from '../../utils/browsermob_helpers';

const HOST_NAME = process.env.DA_HUB_IP || 'localhost';
const seleniumServer = require('selenium-server');
const chromedriver = require('chromedriver');
const geckodriver = require('geckodriver');
const NETWORK_LOGGING_ENABLED = process.env.NETWORK_LOGGING_ENABLED === 'true';
const port = NETWORK_LOGGING_ENABLED ? getProxyPort() : undefined;
const proxy = NETWORK_LOGGING_ENABLED
    ? {
        proxyType: 'manual',
        httpProxy: `${HOST_NAME}:${port}`,
        sslProxy: `${HOST_NAME}:${port}`
    }
    : undefined;

const localBrowsersConfigs = {
    output_folder: './reports',
    page_objects_path: `${process.env.frameworkPath}page_objects`,
    parallel_process_delay: 3000,
    test_workers: {
        enabled: true,
        workers: 15
    },
    custom_assertions_path: ['./node_modules/nightwatch-accessibility/assertions'],
    custom_commands_path: [
        './node_modules/nightwatch-accessibility/commands',
        './node_modules/common-nightwatch/dist/commands'
    ],
    live_output: true,
    disable_colors: false,
    selenium: {
        start_process: true,
        server_path: seleniumServer.path,
        port: 4444,
        cli_args: {
            'webdriver.chrome.driver': chromedriver.path,
            'webdriver.gecko.driver': geckodriver.path,
            'webdriver.safari.driver': '/usr/bin/safaridriver',
            'webdriver.firefox.profile': 'nightwatch'
        }
    },
    test_settings: {
        default: {
            selenium_port: 4444,
            selenium_host: 'localhost',
            silent: true,
            screenshots: {
                enabled: true,
                path: './reports/screenshots',
                on_failure: true,
                on_error: true
            },
            desiredCapabilities: {
                browserName: 'chrome',
                acceptInsecureCerts: true
            }
        },
        chrome: {
            desiredCapabilities: {
                browserName: 'chrome',
                javascriptEnabled: true,
                acceptSslCerts: true,
                loggingPrefs: { browser: 'INFO' },
                'goog:chromeOptions': {
                    args: ['--window-size=1920,1080'],
                    w3c: false
                },
                proxy: proxy
            }
        },
        chromeGalaxyS5: {
            desiredCapabilities: {
                browserName: 'chrome',
                javascriptEnabled: true,
                acceptSslCerts: true,
                loggingPrefs: { browser: 'INFO' },
                'goog:chromeOptions': {
                    w3c: false,
                    mobileEmulation: {
                        deviceName: 'Galaxy S5'
                    }
                },
                proxy: proxy
            }
        },
        chromeIphoneX: {
            desiredCapabilities: {
                browserName: 'chrome',
                javascriptEnabled: true,
                acceptSslCerts: true,
                loggingPrefs: { browser: 'INFO' },
                'goog:chromeOptions': {
                    w3c: false,
                    mobileEmulation: {
                        deviceName: 'iPhone X'
                    }
                },
                proxy: proxy
            }
        },
        chromeIpad: {
            desiredCapabilities: {
                browserName: 'chrome',
                javascriptEnabled: true,
                acceptSslCerts: true,
                loggingPrefs: { browser: 'INFO' },
                'goog:chromeOptions': {
                    w3c: false,
                    mobileEmulation: {
                        deviceName: 'iPad'
                    }
                },
                proxy: proxy
            }
        },
        safari: {
            selenium: {
                port: 4445
            },
            desiredCapabilities: {
                browserName: 'safari',
                javascriptEnabled: true,
                acceptSslCerts: true,
                acceptInsecureCerts: false
            }
        },
        chrome_headless: {
            desiredCapabilities: {
                browserName: 'chrome',
                javascriptEnabled: true,
                acceptSslCerts: true,
                chromeOptions: {
                    args: ['window-size=1280,2000', 'headless', 'disable-gpu'],
                    w3c: false
                }
            },
            selenium: {
                cli_args: {
                    'webdriver.chrome.driver': chromedriver.path
                }
            }
        },
        firefox: {
            desiredCapabilities: {
                browserName: 'firefox',
                javascriptEnabled: true,
                acceptSslCerts: true,
                marionette: true
            }
        },
        autoscaleGrid_chrome: {
            selenium_host: process.env.DA_HUB_IP,
            selenium_port: 4444,
            selenium: {
                start_process: false
            },
            silent: true,
            desiredCapabilities: {
                browserName: 'chrome',
                acceptInsecureCerts: true,
                loggingPrefs: { browser: 'SEVERE' },
                chromeOptions: {
                    args: ['window-size=1280,2000']
                },
                proxy: proxy
            }
        },
        autoscaleGrid_firefox: {
            selenium_host: process.env.DA_HUB_IP,
            selenium_port: 4444,
            selenium: {
                start_process: false
            },
            silent: true,
            desiredCapabilities: {
                browserName: 'firefox',
                javascriptEnabled: true,
                acceptSslCerts: true,
                marionette: true
            }
        },
        appium_ios: {
            selenium_host: '127.0.0.1',
            selenium: {
                start_process: false,
                port: 4723
            },
            silent: true,
            automationName: 'XCUITest',
            desiredCapabilities: {
                browserName: 'Safari',
                platformName: 'iOS',
                platformVersion: '12.1',
                deviceName: 'iPhone 8'
            }
        },
        dakubeGrid_Chrome: {
            selenium_host: process.env.kube_namespace + '.hub.test.expedia.com',
            use_ssl: true,
            selenium: {
                start_process: false,
                port: 443
            },
            silent: true,
            desiredCapabilities: {
                browserName: 'chrome',
                acceptInsecureCerts: true,
                javascriptEnabled: true,
                loggingPrefs: { browser: 'INFO', driver: 'INFO' },
                'goog:chromeOptions': {
                    args: [
                        'window-size=1920,1080',
                        '--no-sandbox',
                        '--ignore-certificate-errors',
                        '--disable-translate',
                        '--disable-logging',
                        '--allow-insecure-localhost',
                        '--acceptInsecureCerts',
                        '--disable-popup-blocking',
                        '--no-proxy-server',
                        '--disable-plugins'
                    ],
                    w3c: false
                },
                proxy: proxy
            }
        },
        dakubeGrid_Chrome_Segment: {
            selenium_host: process.env.kube_namespace + '.eg-utap-dakube.us-west-2.test.expweb.expedia.com',
            use_ssl: true,
            selenium: {
                start_process: false,
                port: 443
            },
            silent: true,
            desiredCapabilities: {
                browserName: 'chrome',
                acceptInsecureCerts: true,
                javascriptEnabled: true,
                loggingPrefs: { browser: 'INFO', driver: 'INFO' },
                'goog:chromeOptions': {
                    args: [
                        'window-size=1920,1080',
                        '--no-sandbox',
                        '--ignore-certificate-errors',
                        '--disable-translate',
                        '--disable-logging',
                        '--allow-insecure-localhost',
                        '--acceptInsecureCerts',
                        '--disable-popup-blocking',
                        '--no-proxy-server',
                        '--disable-plugins'
                    ],
                    w3c: false
                },
                proxy: proxy
            }
        },
        dakubeGrid_ChromeIphoneX: {
            selenium_host: process.env.kube_namespace + '.hub.test.expedia.com',
            use_ssl: true,
            selenium: {
                start_process: false,
                port: 443
            },
            silent: true,
            desiredCapabilities: {
                browserName: 'chrome',
                acceptInsecureCerts: true,
                javascriptEnabled: true,
                loggingPrefs: { browser: 'INFO', driver: 'INFO' },
                'goog:chromeOptions': {
                    args: [
                        'window-size=1920,1080',
                        '--no-sandbox',
                        '--ignore-certificate-errors',
                        '--disable-translate',
                        '--disable-logging',
                        '--allow-insecure-localhost',
                        '--acceptInsecureCerts',
                        '--disable-popup-blocking',
                        '--no-proxy-server',
                        '--disable-plugins'
                    ],
                    mobileEmulation: {
                        deviceName: 'iPhone X'
                    },
                    w3c: false
                },
                proxy: proxy
            }
        },
        dakubeGrid_ChromeGalaxyS5: {
            selenium_host: process.env.kube_namespace + '.hub.test.expedia.com',
            use_ssl: true,
            selenium: {
                start_process: false,
                port: 443
            },
            silent: true,
            desiredCapabilities: {
                browserName: 'chrome',
                acceptInsecureCerts: true,
                javascriptEnabled: true,
                loggingPrefs: { browser: 'INFO', driver: 'INFO' },
                'goog:chromeOptions': {
                    args: [
                        'window-size=1920,1080',
                        '--no-sandbox',
                        '--ignore-certificate-errors',
                        '--disable-translate',
                        '--disable-logging',
                        '--allow-insecure-localhost',
                        '--acceptInsecureCerts',
                        '--disable-popup-blocking',
                        '--no-proxy-server',
                        '--disable-plugins'
                    ],
                    mobileEmulation: {
                        deviceName: 'Galaxy S5'
                    },
                    w3c: false
                },
                proxy: proxy
            }
        },
        dakubeGrid_ChromeIpad: {
            selenium_host: process.env.kube_namespace + '.hub.test.expedia.com',
            use_ssl: true,
            selenium: {
                start_process: false,
                port: 443
            },
            silent: true,
            desiredCapabilities: {
                browserName: 'chrome',
                acceptInsecureCerts: true,
                javascriptEnabled: true,
                loggingPrefs: { browser: 'INFO', driver: 'INFO' },
                'goog:chromeOptions': {
                    args: [
                        'window-size=1920,1080',
                        '--no-sandbox',
                        '--ignore-certificate-errors',
                        '--disable-translate',
                        '--disable-logging',
                        '--allow-insecure-localhost',
                        '--acceptInsecureCerts',
                        '--disable-popup-blocking',
                        '--no-proxy-server',
                        '--disable-plugins'
                    ],
                    mobileEmulation: {
                        deviceName: 'iPad'
                    },
                    w3c: false
                },
                proxy: proxy
            }
        }
    }
};

console.info('Using local browsers Config file');
module.exports = localBrowsersConfigs;
