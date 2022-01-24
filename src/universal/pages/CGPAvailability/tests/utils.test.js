import {defineClassByValue, extractColumns, filterAvailabilityByMinValue, formattedValue, getAppErrorsDataForChart, mapAvailabilityRow} from '../utils';
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
});

describe('formattedValue()', () => {
    it('returns dash when no input', () => {
        const value = formattedValue();
        expect(value).to.be.eqls('-');
    });

    it('returns value in int when input is a string', () => {
        const value = formattedValue('100');
        expect(value).to.be.eqls(100);
    });

    it('truncates to second digit when input has 3 decimals', () => {
        const value = formattedValue('99.999');
        expect(value).to.be.eqls(99.99);
    });

    it('returns dash when input is a not a number', () => {
        const value = formattedValue('test');
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
        expect(appErrors).to.be.eqls([{'5xx Errors': 1, 'name': 'Dec 7, 2021'}, {'5xx Errors': 1, 'name': 'Dec 6, 2021'}, {'5xx Errors': 1, 'name': 'Dec 5, 2021'}, {'5xx Errors': 1, 'name': 'Dec 4, 2021'}, {'5xx Errors': 1, 'name': 'Dec 3, 2021'}, {'5xx Errors': 1, 'name': 'Dec 2, 2021'}, {'5xx Errors': 1, 'name': 'Dec 1, 2021'}]);
    });
});

describe('extractColumns()', () => {
    it('returns only the first column Application when no input', () => {
        const columns = extractColumns();
        expect(columns).to.be.eqls(['Application']);
    });

    it('returns only the first column Application when input is empty array', () => {
        const columns = extractColumns([]);
        expect(columns).to.be.eqls(['Application']);
    });

    it('returns array with Application and extracted dates', () => {
        const columns = extractColumns(AVAILABILITY);
        expect(columns).to.be.eqls(['Application', 'Dec 7, 2021', 'Dec 6, 2021', 'Dec 5, 2021', 'Dec 4, 2021', 'Dec 3, 2021', 'Dec 2, 2021', 'Dec 1, 2021']);
    });
});

describe('mapAvailabilityRow()', () => {
    it('returns empty object if no row is passed', () => {
        const columns = mapAvailabilityRow();
        expect(columns).to.be.eqls({});
    });

    it('returns row mapped ', () => {
        let handleClick; // undefined
        const columns = mapAvailabilityRow(AVAILABILITY[0]);
        expect(columns.Application).to.be.eql('cars-shopping-service');
        expect(columns['Dec 1, 2021'].props).to.be.eql({applicationName: 'cars-shopping-service', value: 100, handleClick});
        expect(columns['Dec 2, 2021'].props).to.be.eql({applicationName: 'cars-shopping-service', value: 99.59, handleClick});
        expect(columns['Dec 3, 2021'].props).to.be.eql({applicationName: 'cars-shopping-service', value: 60, handleClick});
    });
});

describe('filterAvailabilityByMinValue()', () => {
    it('returns false when there are no days with avaialability lower than the minValue', () => {
        const columns = filterAvailabilityByMinValue(AVAILABILITY[0], 50);
        expect(columns).to.be.eqls(false);
    });

    it('returns false when there are no days with avaialability lower than the minValue', () => {
        const columns = filterAvailabilityByMinValue(AVAILABILITY[0], 70);
        expect(columns).to.be.eqls(true);
    });

    it('returns false when there are no availabilities', () => {
        const columns = filterAvailabilityByMinValue([], 70);
        expect(columns).to.be.eqls(false);
    });
});