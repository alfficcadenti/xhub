import React from 'react';
import {expect} from 'chai';
import {
    divisionToBrand,
    consolidateTicketsById,
    getListOfUniqueProperties,
    isNotEmptyString,
    isNotDuplicate,
    sortArrayByMostRecentDate,
    buildTicketLink,
    getVisiblePages,
    getImpactedPartners,
    mapEpsData,
    parseDurationToMs
} from './utils';
import {VRBO_BRAND, HOTELS_COM_BRAND, EXPEDIA_BRAND, EGENCIA_BRAND, EXPEDIA_PARTNER_SERVICES_BRAND} from '../constants';


describe('divisionToBrand', () => {
    it('returns Egencia when the input value is EGENCIA - CONSOLIDATED', () => {
        const result = divisionToBrand('EGENCIA - CONSOLIDATED');
        expect(result).to.be.eql(EGENCIA_BRAND);
    });

    it('returns Vrbo when the input value is VRBO or HOME AWAY', () => {
        const result = divisionToBrand('VRBO');
        expect(result).to.be.eql(VRBO_BRAND);
        const result2 = divisionToBrand('HOME AWAY');
        expect(result2).to.be.eql(VRBO_BRAND);
    });

    it('returns Hotels.com Retail when the input value is HOTELS WORLDWIDE (HWW)', () => {
        const result = divisionToBrand('HOTELS WORLDWIDE (HWW)');
        expect(result).to.be.eql(HOTELS_COM_BRAND);
        const result2 = divisionToBrand('HCOM');
        expect(result2).to.be.eql(HOTELS_COM_BRAND);
    });

    it('returns BEX - Expedia Group as default when the input value doesn t match', () => {
        const result = divisionToBrand('random text');
        expect(result).to.be.eql(EXPEDIA_BRAND);
    });

    it('returns Expedia Group if division is empty', () => {
        const result = divisionToBrand();
        expect(result).to.be.eql(EXPEDIA_BRAND);
    });

    it('returns Expedia Group if division is null', () => {
        const result = divisionToBrand(null);
        expect(result).to.be.eql(EXPEDIA_BRAND);
    });
});

describe('consolidateTicketsById', () => {
    it('consolidates impactedBrands, revenue loss, and gross loss for tickets with same id', () => {
        const tickets = [{
            id: 'INC-0001',
            impactedBrand: 'vrbo',
            estimatedRevenueLoss: '1000',
            estimatedGrossLoss: '2222',
            divisions: ['E4P', 'Total Retail']
        }, {
            id: 'INC-0001',
            impactedBrand: 'expedia',
            estimatedRevenueLoss: '2005',
            estimatedGrossLoss: '15',
            divisions: ['vrbo']
        }, {
            id: 'INC-0001',
            impactedBrand: 'expedia',
            estimatedRevenueLoss: '0',
            estimatedGrossLoss: '0',
            divisions: ['division']
        }, {
            id: 'INC-0002',
            impactedBrand: 'hotels',
            estimatedRevenueLoss: '1',
            estimatedGrossLoss: '2',
            divisions: ['E4P']
        }];
        const result = consolidateTicketsById(tickets);
        expect(result).to.be.eql([{
            id: 'INC-0001',
            impactedBrand: 'vrbo,expedia',
            estimatedRevenueLoss: '3005',
            estimatedGrossLoss: '2237',
            divisions: ['E4P', 'Total Retail', 'vrbo', 'division']
        }, {
            id: 'INC-0002',
            impactedBrand: 'hotels',
            estimatedRevenueLoss: '1',
            estimatedGrossLoss: '2',
            divisions: ['E4P']
        }]);
    });

    it('returns Vrbo when the input value is VRBO or HOME AWAY', () => {
        const result = divisionToBrand('VRBO');
        expect(result).to.be.eql(VRBO_BRAND);
        const result2 = divisionToBrand('HOME AWAY');
        expect(result2).to.be.eql(VRBO_BRAND);
    });

    it('returns Hotels.com Retail when the input value is HOTELS WORLDWIDE (HWW)', () => {
        const result = divisionToBrand('HOTELS WORLDWIDE (HWW)');
        expect(result).to.be.eql(HOTELS_COM_BRAND);
        const result2 = divisionToBrand('HCOM');
        expect(result2).to.be.eql(HOTELS_COM_BRAND);
    });

    it('returns BEX - Expedia Group as default when the input value doesn t match', () => {
        const result = divisionToBrand('random text');
        expect(result).to.be.eql(EXPEDIA_BRAND);
    });

    it('returns Expedia Group if division is empty', () => {
        const result = divisionToBrand();
        expect(result).to.be.eql(EXPEDIA_BRAND);
    });

    it('returns Expedia Group if division is null', () => {
        const result = divisionToBrand(null);
        expect(result).to.be.eql(EXPEDIA_BRAND);
    });
});

describe('getListOfUniqueProperties', () => {
    it('returns list of unique properties', () => {
        const mockRawIncidents = [
            {tag: 't0', priority: 'p0'},
            {tag: ['t0', 't1'], priority: 'p1'},
            {tag: ['t2'], priority: 'p1'},
            {tag: [], priority: 'p2'},
            {tag: '', priority: ''}
        ];
        const expectedTags = ['t0', 't1', 't2'];
        const expectedPriorities = ['p0', 'p1', 'p2'];
        expect(getListOfUniqueProperties(mockRawIncidents, 'tag')).to.be.eql(expectedTags);
        expect(getListOfUniqueProperties(mockRawIncidents, 'priority')).to.be.eql(expectedPriorities);
    });
});

describe('isNotEmptyString', () => {
    it('removes empty strings from array', () => {
        const arr = ['', 'a', 'b', '', 'c', ''];
        expect(arr.filter(isNotEmptyString)).to.be.eql(['a', 'b', 'c']);
    });
});

describe('isNotDuplicate', () => {
    it('removes duplicates from array', () => {
        const arr = ['', 'a', 'A', '', 11, 'a', 11, 'A', 'b', 'c'];
        expect(arr.filter(isNotDuplicate)).to.be.eql(['', 'a', 'A', 11, 'b', 'c']);
    });
});

describe('sortArrayByMostRecentDate', () => {
    it('sorts array by most recent date by specified property', () => {
        const arr = [
            {a: '2020-05-01', b: '2020-02-02'},
            {a: '2020-06-21', b: '2020-03-03'},
            {a: '2020-05-11', b: '2010-05-02'}
        ];
        expect(sortArrayByMostRecentDate(arr, 'a').map((obj) => obj.a)).to.be.eql(['2020-06-21', '2020-05-11', '2020-05-01']);
        expect(sortArrayByMostRecentDate(arr, 'b').map((obj) => obj.b)).to.be.eql(['2020-03-03', '2020-02-02', '2010-05-02']);
    });
});

describe('buildTicketLink()', () => {
    it('return a href link to url if url is passed', () => {
        expect(buildTicketLink('INC1234', '', 'www.test.com/')).to.be.eql(<a href="www.test.com/" target="_blank">{'INC1234'}</a>);
    });

    it('return a href link to homeaway Jira if url is not passed and brand is VRBO', () => {
        expect(buildTicketLink('INC1234', VRBO_BRAND, '')).to.be.eql(<a href="https://jira.homeawaycorp.com/browse/INC1234" target="_blank">{'INC1234'}</a>);
    });

    it('return a href link to expedia service now if ticket is not vrbo', () => {
        expect(buildTicketLink('INC1234', '', '')).to.be.eql(<a href="https://expedia.service-now.com/go.do?id=INC1234" target="_blank">{'INC1234'}</a>);
    });
});

describe('getVisiblePages', () => {
    it('displays only visible pages', () => {
        const visibleIds = ['visible-a', 'visible-b'];
        const pages = [{id: 'hidden', hidden: true}, {id: visibleIds[0], hidden: false}, {id: visibleIds[1]}];
        const result = getVisiblePages([VRBO_BRAND], pages);
        expect(result.length).to.be.equal(2);
        expect(result[0].id).to.be.equal(visibleIds[0]);
        expect(result[1].id).to.be.equal(visibleIds[1]);
    });
    it('displays pages be whitelisted brands', () => {
        const visibleIds = ['brand-a', 'brand-b'];
        const pages = [{id: visibleIds[0], brands: [VRBO_BRAND]}, {id: 'hidden', brands: [HOTELS_COM_BRAND]}, {id: visibleIds[1]}];
        const result = getVisiblePages([VRBO_BRAND], pages);
        expect(result.length).to.be.equal(2);
        expect(result[0].id).to.be.equal(visibleIds[0]);
        expect(result[1].id).to.be.equal(visibleIds[1]);
    });
});

describe('getImpactedPartners', () => {
    it('parses empty impacted partners correctly', () => {
        expect(getImpactedPartners()).to.eql(null);
    });

    it('parses string impacted partners & lobs correctly', () => {
        expect(getImpactedPartners('[\'CHASE\',\'AMEX\']', ['Air'])).to.eql('CHASE-Air, AMEX-Air');
    });

    it('parses array impacted partners & lobs correctly', () => {
        expect(getImpactedPartners(['CHASE', 'AMEX'], ['Air', 'Car'])).to.eql('CHASE-Air, CHASE-Car, AMEX-Air, AMEX-Car');
    });

    it('parses just partners correctly', () => {
        expect(getImpactedPartners(['CHASE', 'AMEX'])).to.eql(['CHASE', 'AMEX']);
    });
});

describe('mapEpsData', () => {
    it('parses string time to metrics correctly', () => {
        const data = {
            duration: '1 hour',
            timeToDetect: '10 minutes',
            timeToResolve: '50 minutes'
        };
        expect(mapEpsData(data)).to.eql({
            brand: EXPEDIA_PARTNER_SERVICES_BRAND,
            impactedBrand: EXPEDIA_PARTNER_SERVICES_BRAND,
            duration: 1 * 60 * 60 * 1000,
            timeToDetect: 10 * 60 * 1000,
            timeToResolve: 50 * 60 * 1000,
            impactedPartners: null,
            impactedPartnersLobs: null
        });
    });
    it('parses numeric time to metrics correctly', () => {
        const data = {
            duration: 30000,
            timeToDetect: 20000,
            timeToResolve: 10000
        };
        expect(mapEpsData(data)).to.eql({
            brand: EXPEDIA_PARTNER_SERVICES_BRAND,
            impactedBrand: EXPEDIA_PARTNER_SERVICES_BRAND,
            duration: data.duration,
            timeToDetect: data.timeToDetect,
            timeToResolve: data.timeToResolve,
            impactedPartners: null,
            impactedPartnersLobs: null
        });
    });
});

describe('parseDurationToMs', () => {
    const minutesToMs = (m) => m * 60000;
    const hoursToMs = (h) => h * 60 * minutesToMs(1);
    const daysToMs = (d) => d * 24 * hoursToMs(1);
    it('parses duration correctly', () => {
        expect(parseDurationToMs('1 minute')).to.be.equal(minutesToMs(1));
        expect(parseDurationToMs('59 minutes')).to.be.equal(minutesToMs(59));
        expect(parseDurationToMs('61 minutes')).to.be.equal(minutesToMs(61));
        expect(parseDurationToMs('1 hour')).to.be.equal(hoursToMs(1));
        expect(parseDurationToMs('3 hours 2 minutes')).to.be.equal(hoursToMs(3) + minutesToMs(2));
        expect(parseDurationToMs('1 day')).to.be.equal(daysToMs(1));
        expect(parseDurationToMs('1 day 1 minute')).to.be.equal(daysToMs(1) + minutesToMs(1));
        expect(parseDurationToMs('2 days 2 hours 3 minutes')).to.be.equal(daysToMs(2) + hoursToMs(2) + minutesToMs(3));
    });
});
