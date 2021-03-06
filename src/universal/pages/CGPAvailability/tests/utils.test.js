import {
    defineClassByValue,
    exactAvailability,
    extractColumns,
    formattedValue,
    getAppErrorsDataForChart,
    periodAvailability,
    mapAvailabilityRow,
    getSelectedRegions,
    getTotalStats
} from '../utils';
import {AVAILABILITY, HOURLY_AVAILABILITY} from '../../../../server/routes/api/testData/availability';
import {DATETIME_FORMAT, DATE_FORMAT} from '../constants';
import {expect} from 'chai';
import moment from 'moment';

describe('defineClassByValue()', () => {
    it('returns color for values above high Threshold (99.99)', () => {
        const className = defineClassByValue(99.991);
        expect(className).to.be.equal('positive');
    });

    it('returns color for values above medium Threshold (99.95)', () => {
        const className = defineClassByValue(99.951);
        expect(className).to.be.equal('attention');
    });

    it('returns red color for values below medium Threshold (99.95)', () => {
        const className = defineClassByValue(60);
        expect(className).to.be.equal('negative');
    });

    it('returns default white color when values is not passed', () => {
        const className = defineClassByValue();
        expect(className).to.be.equal('');
    });

    it('returns default white color if values is a string', () => {
        const className = defineClassByValue('test');
        expect(className).to.be.equal('');
    });

    it('returns default white color if values is null', () => {
        const className = defineClassByValue(null);
        expect(className).to.be.equal('');
    });
});

describe('formattedValue()', () => {
    it('returns dash when no input', () => {
        const value = formattedValue();
        expect(value).to.be.eqls('-');
    });

    it('returns value in int when input is a string', () => {
        const value = formattedValue('100');
        expect(value).to.be.eqls('-');
    });

    it('truncates to second digit when input has 3 decimals', () => {
        const value = formattedValue(99.999);
        expect(value).to.be.eqls(99.99);
    });

    it('returns dash when input is a not a number', () => {
        const value = formattedValue('test');
        expect(value).to.be.eqls('-');
    });

    it('returns dash when input is null', () => {
        const value = formattedValue(null);
        expect(value).to.be.eqls('-');
    });
});

describe('getAppErrorsDataForChart()', () => {
    it('returns empty array when no input', () => {
        const appErrors = getAppErrorsDataForChart();
        expect(appErrors).to.be.eqls([]);
    });

    it('returns empty array when applicationName is empty', () => {
        const applicationName = '';
        const availability = AVAILABILITY;
        const appErrors = getAppErrorsDataForChart(applicationName, availability);
        expect(appErrors).to.be.eqls([]);
    });

    it('returns empty array when availability is not an array', () => {
        const applicationName = 'test';
        const availability = '';
        const appErrors = getAppErrorsDataForChart(applicationName, availability);
        expect(appErrors).to.be.eqls([]);
    });

    it('returns empty array when availability array is empty', () => {
        const applicationName = 'test';
        const availability = [];
        const appErrors = getAppErrorsDataForChart(applicationName, availability);
        expect(appErrors).to.be.eqls([]);
    });

    it('returns array of errors count objects', () => {
        const applicationName = 'cars-shopping-service';
        const availability = AVAILABILITY;
        const appErrors = getAppErrorsDataForChart(applicationName, availability);
        expect(appErrors).to.be.eqls([{'5xx Errors': 1, 'name': '1st Mar 22'}, {'5xx Errors': 10, 'name': '2nd Mar 22'}, {'5xx Errors': 500, 'name': '3rd Mar 22'}, {'5xx Errors': 1, 'name': '4th Mar 22'}, {'5xx Errors': 1, 'name': '5th Mar 22'}, {'5xx Errors': 1, 'name': '6th Mar 22'}, {'5xx Errors': 1, 'name': '7th Mar 22'}]);
    });
});

describe('extractColumns()', () => {
    it('returns empty array with no input', () => {
        const columns = extractColumns();
        expect(columns).to.be.eqls([]);
    });

    it('returns array with Application, extracted dates and Availability', () => {
        const columns = extractColumns(AVAILABILITY, DATE_FORMAT);
        expect(columns).to.be.eqls(['Application', '1st Mar 22', '2nd Mar 22', '3rd Mar 22', '4th Mar 22', '5th Mar 22', '6th Mar 22', '7th Mar 22', 'Availability']);
    });

    it('returns array with Application, extracted hours and Availability', () => {
        const columns = extractColumns(HOURLY_AVAILABILITY, DATETIME_FORMAT);
        const dates = HOURLY_AVAILABILITY[0].availabilities.map((a) => moment(a.timestamp, 'YYYY-MM-DD[T]HH:mm:ssZ').format('hh:mm A'));
        expect(columns).to.be.eqls(['Application', ...dates, 'Availability']);
    });
});

describe('mapAvailabilityRow()', () => {
    it('returns empty object if no row is passed', () => {
        const row = mapAvailabilityRow();
        expect(row).to.be.eqls({});
    });

    it('returns row mapped with DATE_FORMAT Do MMM YY by default', () => {
        let handleClick; // undefined
        const row = mapAvailabilityRow(AVAILABILITY[0]);
        const appName = 'cars-shopping-service';
        expect(row.app).to.be.eql(appName);
        expect(row.Application.props.children).to.be.eql('cars-shopping-service');
        expect(row.Application.props.href).to.be.eql(`https://expediagroup.datadoghq.com/dashboard/yuk-xd8-ik5/sro---cgp-alerting?tpl_var_application=${appName}`);
        expect(row['1st Mar 22'].props).to.be.eql({applicationName: 'cars-shopping-service', value: 99.99, handleClick});
        expect(row['2nd Mar 22'].props).to.be.eql({applicationName: 'cars-shopping-service', value: 99, handleClick});
        expect(row['3rd Mar 22'].props).to.be.eql({applicationName: 'cars-shopping-service', value: '50', handleClick});
    });
});

describe('exactAvailability()', () => {
    it('returns null when requestCount is null', () => {
        expect(exactAvailability(AVAILABILITY[2].availabilities[0].availability, AVAILABILITY[2].availabilities[0].requestCount)).to.be.eqls(null);
    });

    it('returns 0 when requestCount is not null and availaibity is zero', () => {
        expect(exactAvailability(AVAILABILITY[2].availabilities[1].availability, AVAILABILITY[2].availabilities[1].requestCount)).to.be.eqls(0);
    });

    it('returns null when requestCount is zero', () => {
        expect(exactAvailability(AVAILABILITY[2].availabilities[1].availability, 0)).to.be.eqls(null);
    });

    it('returns availability when requestCount is not null and availaibity has a value', () => {
        expect(exactAvailability(AVAILABILITY[2].availabilities[2].availability, AVAILABILITY[2].availabilities[2].requestCount)).to.be.eqls(99.992);
    });
});

describe('periodAvailability()', () => {
    it('returns availability excluding null values', () => {
        expect(periodAvailability(AVAILABILITY[0].availabilities)).to.be.eqls(92.64);
        expect(periodAvailability(AVAILABILITY[1].availabilities)).to.be.eqls(99.9);
        expect(periodAvailability(AVAILABILITY[2].availabilities)).to.be.eqls(79.92);
        expect(periodAvailability([])).to.be.eqls('-');
    });
});

describe('selectedRegions()', () => {
    it('returns a string with the selected regions from the region object', () => {
        const regions = [{
            name: 'all',
            label: 'All',
            checked: true,
            counted: false
        }, {
            name: 'ap-northeast-1',
            label: 'ap-northeast-1',
            nested: true,
            checked: true,
            counted: true
        }, {
            name: 'ap-southeast-1',
            label: 'ap-southeast-1',
            nested: true,
            checked: true,
            counted: true
        }
        ];
        expect(getSelectedRegions(regions)).to.be.eqls('[\"ap-northeast-1\",\"ap-southeast-1\"]');
        const regions2 = [{
            name: 'all',
            label: 'All',
            checked: true,
            counted: false
        }, {
            name: 'ap-northeast-1',
            label: 'ap-northeast-1',
            nested: true,
            checked: true,
            counted: true
        }, {
            name: 'ap-southeast-1',
            label: 'ap-southeast-1',
            nested: true,
            checked: false,
            counted: true
        }
        ];
        expect(getSelectedRegions(regions2)).to.be.eqls('["ap-northeast-1"]');
    });
});

describe('getTotalStats()', () => {
    it('returns an object with totalRequests totalErrors', () => {
        expect(getTotalStats(AVAILABILITY.map((x) => mapAvailabilityRow(x, null, DATE_FORMAT)))).to.be.eqls({'totalErrors': 2529, 'totalRequests': 23000});
    });
    it('returns an object with default values for totalRequests totalErrors when empty array is passed in input', () => {
        expect(getTotalStats([])).to.be.eqls({'totalErrors': 0, 'totalRequests': 0});
    });
});