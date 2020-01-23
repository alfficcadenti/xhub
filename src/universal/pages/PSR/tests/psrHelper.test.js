import {expect} from 'chai';
import h from '../psrHelpers';
import mockData from './data.test.json';

const brands = ['egencia', 'vrbo'];

const vrboPSRs = [{
    'date': '2019-12-05',
    'brand': 'vrbo',
    'successPercentage': 84.0,
    'interval': 'daily',
    'lineofbusiness': 'PSR'
},
{
    'date': '2019-12-07',
    'brand': 'vrbo',
    'successPercentage': 82.7,
    'interval': 'monthly',
    'lineofbusiness': 'PSR'
},
{
    'date': '2019-12-06',
    'brand': 'vrbo',
    'successPercentage': 85.0,
    'interval': 'monthly',
    'lineofbusiness': 'PSR Flights'
}];

const dailyPSRs = [
    {
        'date': '2019-12-06',
        'brand': 'egencia',
        'successPercentage': 97.0,
        'interval': 'daily',
        'lineofbusiness': 'PSR'
    },
    {
        'date': '2019-12-05',
        'brand': 'egencia',
        'successPercentage': 88.8,
        'interval': 'daily',
        'lineofbusiness': 'PSR'
    },
    {
        'date': '2019-12-05',
        'brand': 'vrbo',
        'successPercentage': 84.0,
        'interval': 'daily',
        'lineofbusiness': 'PSR'
    }
];

const lobPSRs = [{
    'date': '2019-12-06',
    'brand': 'vrbo',
    'successPercentage': 85.0,
    'interval': 'monthly',
    'lineofbusiness': 'PSR Flights'
}];

const vrboPsr = {'brand': 'vrbo', 'date': '2019-12-07', 'successPercentage': 82.7, 'interval': 'monthly', 'lineofbusiness': 'PSR'};

const psrDetailsForTable = [{'Last 24 hours': '97.00 %', 'Last 28 days': '82.70 %', 'Last 7 days': '', 'Line Of Business': 'PSR'}, {'Last 24 hours': '', 'Last 28 days': '85.00 %', 'Last 7 days': '', 'Line Of Business': 'PSR Flights'}];

describe('psrHelpers', () => {
    describe('listOfBrands()', () => {
        it('returns empty array if data is not passed', () => {
            const result = h.listOfBrands();
            expect(result).to.be.eql([]);
        });

        it('returns an array with list of brands', () => {
            const result = h.listOfBrands(mockData);
            expect(result).to.be.eql(brands);
        });
    });

    describe('psrValuesByBrand()', () => {
        it('returns empty array if data is not passed', () => {
            const result = h.psrValuesByBrand();
            expect(result).to.be.eql([]);
        });

        it('returns an array with list of the psrValues for the brand', () => {
            const result = h.psrValuesByBrand(mockData, 'vrbo');
            expect(result).to.be.eql(vrboPSRs);
        });
    });

    describe('psrValuesByInterval()', () => {
        it('returns empty array if data is not passed', () => {
            const result = h.psrValuesByInterval();
            expect(result).to.be.eql([]);
        });

        it('returns an array with list of of the psrValues for the interval', () => {
            const result = h.psrValuesByInterval(mockData, 'daily');
            expect(result).to.be.eql(dailyPSRs);
        });
    });

    describe('findPSRValueByInterval()', () => {
        it('returns undefined if data is not passed', () => {
            const result = h.findPSRValueByInterval();
            // eslint-disable-next-line no-undefined
            expect(result).to.be.eql(undefined);
        });

        it('returns the first value with the interval specified from an array in input', () => {
            const firstDaily = {'brand': 'egencia', 'date': '2019-12-06', 'interval': 'daily', 'lineofbusiness': 'PSR', 'successPercentage': 97};
            const result = h.findPSRValueByInterval(mockData, 'daily');
            expect(result).to.be.eql(firstDaily);
        });
    });

    describe('psrValuesByLOB()', () => {
        it('returns empty array if data is not passed', () => {
            const result = h.psrValuesByLOB();
            expect(result).to.be.eql([]);
        });

        it('returns an array with list of the psrValues for the LOB', () => {
            const result = h.psrValuesByLOB(mockData, 'PSR Flights');
            expect(result).to.be.eql(lobPSRs);
        });
    });

    describe('lastPSRAvailableDate()', () => {
        it('returns empty string if data is not passed', () => {
            const result = h.lastPSRAvailableDate();
            expect(result).to.be.eql('');
        });

        it('returns an array with list of the psrValues for the brand', () => {
            const result = h.lastPSRAvailableDate(h.psrValuesByBrand(mockData, 'vrbo'));
            expect(result).to.be.eql('2019-12-07');
        });
    });

    describe('getPSROnDate()', () => {
        it('returns empty string if input is not passed', () => {
            const result = h.getPSROnDate();
            // eslint-disable-next-line no-undefined
            expect(result).to.be.eql(undefined);
        });

        it('returns an object with the psrValue', () => {
            const result = h.getPSROnDate(h.psrValuesByBrand(mockData, 'vrbo'), h.lastPSRAvailableDate(h.psrValuesByBrand(mockData, 'vrbo')));
            expect(result).to.be.eql(vrboPsr);
        });
    });

    describe('formatDataForTable()', () => {
        it('returns empty array if input is not passed', () => {
            const result = h.formatDataForTable();
            expect(result).to.be.eql([]);
        });

        it('returns an array with data formatted for the table', () => {
            const result = h.formatDataForTable(mockData);
            expect(result).to.be.eql(psrDetailsForTable);
        });
    });

    describe('brandLogoFile()', () => {
        it('returns undefined when no input', () => {
            const result = h.brandLogoFile();
            expect(result).to.be.eql(null);
        });

        it('returns undefined for input different than vrbo, egencia or hcom', () => {
            const results = h.brandLogoFile('test');
            expect(results).to.be.eql(null);
        });
    });
});
