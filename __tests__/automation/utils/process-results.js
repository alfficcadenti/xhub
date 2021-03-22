/* eslint-disable complexity */
/* eslint-disable consistent-return */
/* eslint-disable no-shadow */

const fs = require('fs');
const resultJsonPath = './reports/cucumber.json';
const fileName = './reports/scenarioPassingRatio.property';

module.exports = function processResults() {
    const jsonFile = require('jsonfile');
    const featureOutput = jsonFile.readFileSync(resultJsonPath);

    const result = {
        status: {
            ambiguous: 'ambiguous',
            failed: 'failed',
            passed: 'passed',
            pending: 'pending',
            skipped: 'skipped',
            undefined: 'undefined'
        }
    };

    const suite = {
        features: {
            ambiguous: 0,
            failed: 0,
            isFailed: false,
            notdefined: 0,
            passed: 0,
            pending: 0,
            skipped: 0,
            total: 0
        },
        scenarios: {
            ambiguous: 0,
            failed: 0,
            notdefined: 0,
            passed: 0,
            pending: 0,
            skipped: 0,
            total: 0
        },
        suites: [],
        totalTime: 0
    };

    const setStats = function (suite) {
        const featuresSummary = suite.features;
        suite.reportAs = 'Features';

        featureOutput.forEach((feature) => {
            feature.scenarios = {};
            feature.scenarios.passed = 0;
            feature.scenarios.failed = 0;
            feature.scenarios.notdefined = 0;
            feature.scenarios.skipped = 0;
            feature.scenarios.pending = 0;
            feature.scenarios.ambiguous = 0;
            feature.scenarios.count = 0;
            feature.time = 0;
            featuresSummary.isFailed = false;
            featuresSummary.isAmbiguous = false;

            if (!feature.elements) {
                return;
            }

            feature.elements.forEach((element) => {
                element.passed = 0;
                element.failed = 0;
                element.notdefined = 0;
                element.skipped = 0;
                element.pending = 0;
                element.ambiguous = 0;
                element.time = 0;
                element.timestamp = '';
                element.notes = '';

                if (element.type === 'background') {
                    return;
                }

                element.steps.forEach((step) => {
                    if (step.result.duration) {
                        element.time += step.result.duration;
                    }

                    switch (step.result.status) {
                        case result.status.passed:
                            return element.passed++;
                        case result.status.failed:
                            return element.failed++;
                        case result.status.undefined:
                            return element.notdefined++;
                        case result.status.pending:
                            return element.pending++;
                        case result.status.ambiguous:
                            return element.ambiguous++;
                        default:
                            break;
                    }

                    element.skipped++;
                });

                if (element.time > 0) {
                    feature.time += element.time;
                }

                feature.scenarios.count++;
                suite.scenarios.total++;

                if (element.failed > 0) {
                    feature.scenarios.failed++;
                    featuresSummary.isFailed = true;

                    return suite.scenarios.failed++;
                }

                if (element.ambiguous > 0) {
                    feature.scenarios.ambiguous++;
                    featuresSummary.isAmbiguous = true;

                    return suite.scenarios.ambiguous++;
                }

                if (element.notdefined > 0) {
                    feature.scenarios.notdefined++;

                    return suite.scenarios.notdefined++;
                }

                if (element.pending > 0) {
                    feature.scenarios.pending++;

                    return suite.scenarios.pending++;
                }

                if (element.skipped > 0) {
                    feature.scenarios.skipped++;

                    return suite.scenarios.skipped++;
                }

                if (element.passed > 0) {
                    feature.scenarios.passed++;

                    return suite.scenarios.passed++;
                }
            });

            if (featuresSummary.isFailed) {
                featuresSummary.failed++;
            } else if (featuresSummary.isAmbiguous) {
                featuresSummary.ambiguous++;
            } else if (feature.scenarios.count === feature.scenarios.skipped) {
                featuresSummary.skipped++;
            } else if (feature.scenarios.count === feature.scenarios.notdefined) {
                featuresSummary.notdefined++;
            } else if (feature.scenarios.count === feature.scenarios.pending) {
                featuresSummary.pending++;
            } else {
                featuresSummary.passed++;
            }

            featuresSummary.total++;

            if (feature.time) {
                suite.totalTime += feature.time;
            }

            return suite;
        });

        suite.scenarioPassingRatio = (suite.scenarios.passed / (suite.scenarios.total - suite.scenarios.skipped)).toFixed(
            2
        );
        console.info(
            `(suite.scenarios.passed / (suite.scenarios.total - suite.scenarios.skipped) = ${suite.scenarios.passed} / (${suite.scenarios.total} - ${suite.scenarios.skipped})`
        );
        fs.createWriteStream(fileName).write(`scenarioPassingRatio=${suite.scenarioPassingRatio}`);
        console.info(`"scenarioPassingRatio=${suite.scenarioPassingRatio}" was saved to file ${fileName}`);

        return suite;
    };

    return setStats(suite);
};