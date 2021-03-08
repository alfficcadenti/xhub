const seleniumHostBs = 'hub-cloud.browserstack.com';
const seleniumPortBs = 443;
const seleniumBrowserStackConfigs = {
    start_process: false,
    host: seleniumHostBs,
    port: seleniumPortBs
};
const screenShotConfig = {
    enabled: true,
    path: './reports/screenshots',
    on_failure: true,
    on_error: true
};

const browserStackConfigs = {
    page_objects_path: `${process.env.frameworkPath}page_objects`,
    output_folder: './reports/',
    custom_commands_path: ['./node_modules/common-nightwatch/dist/commands'],
    test_settings: {
        iPhone8: {
            desiredCapabilities: {
                acceptSslCerts: false,
                realMobile: true,
                device: 'iPhone 8',
                os_version: '12',
                build: 'Nightwatch automation - iPhone8 ios 12'
            }
        },
        iPhone8_ios11: {
            desiredCapabilities: {
                acceptSslCerts: false,
                realMobile: true,
                device: 'iPhone 8 Plus',
                os_version: '11',
                build: 'Nightwatch automation - iPhone8 plus ios 11'
            }
        },
        iPhoneXS: {
            desiredCapabilities: {
                realMobile: true,
                device: 'iPhone XS',
                os_version: '12',
                acceptSslCerts: false,
                build: 'Nightwatch automation - iPhone XS ios 12'
            }
        },
        iPhoneXR: {
            desiredCapabilities: {
                realMobile: true,
                device: 'iPhone XR',
                os_version: '12',
                acceptSslCerts: false,
                build: 'Nightwatch automation - iPhone XR ios 12'
            }
        },
        iPhone7: {
            desiredCapabilities: {
                realMobile: true,
                device: 'iPhone 7',
                os_version: '10',
                build: 'Nightwatch automation - iPhone 7 ios 10'
            }
        },
        iPad5: {
            desiredCapabilities: {
                acceptSslCerts: false,
                realMobile: true,
                device: 'iPad 5th',
                os_version: '11',
                build: 'Nightwatch automation - iPad 5 ios 11'
            }
        },
        googlePixel3: {
            desiredCapabilities: {
                acceptSslCerts: true,
                realMobile: true,
                device: 'Google Pixel 3 XL',
                os_version: '9.0',
                build: 'Nightwatch automation - Pixel 3 XL Android 9'
            }
        },
        galaxyTabS4: {
            desiredCapabilities: {
                realMobile: true,
                device: 'Galaxy Tab S4',
                os_version: '8.1',
                build: 'Nightwatch automation - Galaxy Tab S4 Android 8.1'
            }
        },
        macosCatalinaSafari: {
            desiredCapabilities: {
                acceptSslCerts: true,
                os: 'OS X',
                os_version: 'Catalina',
                browser: 'Safari',
                browser_version: '13',
                resolution: '1920x1080',
                build: 'Nightwatch & cucumber - macos Catalina Safari'
            }
        },
        macosMojaveSafari: {
            desiredCapabilities: {
                acceptSslCerts: true,
                os: 'OS X',
                os_version: 'Mojave',
                browser: 'Safari',
                browser_version: '12.0',
                resolution: '1920x1080',
                build: 'Nightwatch & cucumber - macos Mojave Safari'
            }
        },
        macosCatalinaEdge: {
            desiredCapabilities: {
                acceptSslCerts: true,
                os: 'OS X',
                os_version: 'Catalina',
                browser: 'Edge',
                browser_version: '80.0',
                resolution: '1920x1080',
                build: 'Nightwatch & cucumber - macos Catalina Edge'
            }
        },
        macosCatalinaFirefox: {
            desiredCapabilities: {
                acceptSslCerts: true,
                os: 'OS X',
                os_version: 'Catalina',
                browser: 'Firefox',
                browser_version: '73.0',
                resolution: '1920x1080',
                build: 'Nightwatch & cucumber - macos Catalina Firefox'
            }
        },
        windows8Ie11: {
            desiredCapabilities: {
                acceptSslCerts: true,
                os: 'Windows',
                os_version: '8.1',
                browser: 'IE',
                browser_version: '11.0',
                resolution: '1920x1200',
                'browserstack.ie.driver': '3.141.59',
                'browserstack.ie.enablePopups': true,
                'browserstack.ie.ensureCleanSession': true,
                build: 'Nightwatch automation - Win 8 IE 11'
            }
        },
        windows10Ie11: {
            desiredCapabilities: {
                acceptSslCerts: true,
                os: 'Windows',
                os_version: '10',
                browser: 'IE',
                browser_version: '11.0',
                resolution: '1920x1200',
                'browserstack.ie.driver': '3.141.59',
                'browserstack.ie.enablePopups': true,
                'browserstack.ie.ensureCleanSession': true,
                build: 'Nightwatch & cucumber - Win 10 IE 11'
            }
        },
        windows10Edge: {
            desiredCapabilities: {
                acceptSslCerts: true,
                os: 'Windows',
                os_version: '10',
                browser: 'Edge',
                browser_version: '18.0',
                resolution: '1920x1200',
                build: 'Nightwatch automation for flights win 10 edge'
            }
        }
    }
};

for (let settingIndex in browserStackConfigs.test_settings) {
    const config = browserStackConfigs.test_settings[settingIndex];

    config['screenshots'] = screenShotConfig;
    config['selenium_host'] = seleniumHostBs;
    config['selenium_port'] = seleniumPortBs;
    config['selenium'] = seleniumBrowserStackConfigs;
    config['desiredCapabilities']['browserstack.selenium_version'] =
        process.env.BROWSERSTACK_selenium_version || '3.141.59';
    config['desiredCapabilities']['browserstack.user'] = process.env.BROWSERSTACK_USER;
    config['desiredCapabilities']['browserstack.key'] = process.env.BROWSERSTACK_KEY;
    config['desiredCapabilities']['browserstack.local'] = true;
    config['desiredCapabilities']['browserstack.debug'] = true;
    config['desiredCapabilities']['browserstack.networkLogs'] = true;
    config['desiredCapabilities']['browserstack.console'] = 'verbose';
    config['desiredCapabilities']['browserstack.localIdentifier'] = process.env.BROWSERSTACK_LOCAL_IDENTIFIER;
    config['desiredCapabilities']['browserstack.use_w3c'] = process.env.BROWSERSTACK_use_w3c;
    config['desiredCapabilities']['project'] = process.env.BS_projectname || 'Nightwatch automation project';
}

console.info('Using browserstack config file');
module.exports = browserStackConfigs;