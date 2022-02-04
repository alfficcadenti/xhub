import {defineClassByValue, exactAvailability, extractColumns, formattedValue, getAppErrorsDataForChart, periodAvailabilityAvg, mapAvailabilityRow} from '../utils';
import {AVAILABILITY} from '../../../../server/routes/api/testData/availability';
import {expect} from 'chai';

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
        expect(appErrors).to.be.eqls([{'5xx Errors': 1, 'name': 'Dec 7, 2021'}, {'5xx Errors': 10, 'name': 'Dec 6, 2021'}, {'5xx Errors': 500, 'name': 'Dec 5, 2021'}, {'5xx Errors': 1, 'name': 'Dec 4, 2021'}, {'5xx Errors': 1, 'name': 'Dec 3, 2021'}, {'5xx Errors': 1, 'name': 'Dec 2, 2021'}, {'5xx Errors': 1, 'name': 'Dec 1, 2021'}]);
    });
});

describe('extractColumns()', () => {
    it('returns only the first column Application when no input', () => {
        const columns = extractColumns();
        expect(columns).to.be.eqls(['Application', 'Average']);
    });

    it('returns only the first column Application when input is empty array', () => {
        const columns = extractColumns([]);
        expect(columns).to.be.eqls(['Application', 'Average']);
    });

    it('returns array with Application and extracted dates', () => {
        const columns = extractColumns(AVAILABILITY);
        expect(columns).to.be.eqls(['Application', 'Dec 7, 2021', 'Dec 6, 2021', 'Dec 5, 2021', 'Dec 4, 2021', 'Dec 3, 2021', 'Dec 2, 2021', 'Dec 1, 2021', 'Average']);
    });
});

describe('mapAvailabilityRow()', () => {
    it('returns empty object if no row is passed', () => {
        const row = mapAvailabilityRow();
        expect(row).to.be.eqls({});
    });

    it('returns row mapped ', () => {
        let handleClick; // undefined
        const row = mapAvailabilityRow(AVAILABILITY[0]);
        expect(row.Application).to.be.eql('cars-shopping-service');
        expect(row['Dec 1, 2021'].props).to.be.eql({applicationName: 'cars-shopping-service', value: 100, handleClick});
        expect(row['Dec 2, 2021'].props).to.be.eql({applicationName: 'cars-shopping-service', value: 99.59, handleClick});
        expect(row['Dec 3, 2021'].props).to.be.eql({applicationName: 'cars-shopping-service', value: 60, handleClick});
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

describe('periodAvailabilityAvg()', () => {
    it('returns average excluding null values', () => {
        expect(periodAvailabilityAvg(AVAILABILITY[0].availabilities)).to.be.eqls(92.64);
        expect(periodAvailabilityAvg(AVAILABILITY[1].availabilities)).to.be.eqls(99.9);
        expect(periodAvailabilityAvg(AVAILABILITY[2].availabilities)).to.be.eqls(79.92);
        expect(periodAvailabilityAvg([])).to.be.eqls('-');
    });
});