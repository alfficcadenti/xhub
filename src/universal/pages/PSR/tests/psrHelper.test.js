import {expect} from 'chai';
import h from '../psrHelpers';
import mockData from './data.test.json';

const brands = ['egencia','vrbo']

const vrboPSRs = [{
    "date": "2019-12-05",
    "brand": "vrbo",
    "successPercentage": 84.0
  },
  {
    "date": "2019-12-07",
    "brand": "vrbo",
    "successPercentage": 82.7
  },
  {
    "date": "2019-12-06",
    "brand": "vrbo",
    "successPercentage": 85.0
  }]

  const vrboPsr = {"brand": "vrbo", "date": "2019-12-07", "successPercentage": 82.7}

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

        it('returns an array with list of of the psrValues for the brand', () => {
            const result = h.psrValuesByBrand(mockData,'vrbo');
            expect(result).to.be.eql(vrboPSRs);
        });
    });

    describe('lastPSRAvailableDate()', () => {
        it('returns empty string if data is not passed', () => {
            const result = h.lastPSRAvailableDate();
            expect(result).to.be.eql('');
        });

        it('returns an array with list of the psrValues for the brand', () => {
            const result = h.lastPSRAvailableDate(h.psrValuesByBrand(mockData,'vrbo'));
            expect(result).to.be.eql('2019-12-07');
        });
    });

    describe('getPSROnDate()', () => {
        it('returns empty string if input is not passed', () => {
            const result = h.getPSROnDate();
            expect(result).to.be.eql(undefined);
        });

        it('returns an object with the psrValue', () => {
            const result = h.getPSROnDate(h.psrValuesByBrand(mockData,'vrbo'),h.lastPSRAvailableDate(h.psrValuesByBrand(mockData,'vrbo')));
            expect(result).to.be.eql(vrboPsr);
        });
    });

    describe('brandLogoFile()', () => {
        it('returns undefined when no input', () => {
            const result = h.brandLogoFile();
            expect(result).to.be.eql(undefined);
        });

        it('returns undefined for input different than vrbo, egencia or hcom', () => {
            const results = h.brandLogoFile('test');
            expect(results).to.be.eql(undefined);
        });
    });
    
});