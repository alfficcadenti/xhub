import React from 'react';
import {expect} from 'chai';
import {
    divisionToBrand,
    consolidateTicketsById,
    getListOfUniqueProperties,
    isNotEmptyString,
    isNotDuplicate,
    sortArrayByMostRecentDate,
    buildTicketLinks,
    buildTicketLink,
    getVisiblePages,
    getImpactedPartners,
    mapEpsData,
    parseDurationToMs,
    getBrand,
    adjustInputValue,
    addSuggestionType,
    getAnnotationsFilter,
    filterNewSelectedItems,
    bucketTime,
    makeSuccessRatesObjects
} from './utils';
import {
    EG_BRAND,
    VRBO_BRAND,
    HOTELS_COM_BRAND,
    EXPEDIA_BRAND,
    EGENCIA_BRAND,
    EXPEDIA_PARTNER_SERVICES_BRAND,
    SUCCESS_RATES_PAGES_LIST
} from '../constants';
import moment from 'moment';
import {successRatesMockData} from './SuccessRates/mockData';

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
        }, {
            id: 'INC-0002,INC-0003',
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
            id: 'INC-0002,INC-0003',
            impactedBrand: 'hotels',
            estimatedRevenueLoss: '2',
            estimatedGrossLoss: '4',
            divisions: ['E4P']
        }]);
    });

    it('ignores tickets with null id', () => {
        const tickets = [{
            id: null,
            impactedBrand: 'hotels',
            estimatedRevenueLoss: '1',
            estimatedGrossLoss: '2',
            divisions: ['E4P']
        }, {
            id: 'INC-0002,INC-0003',
            impactedBrand: 'hotels',
            estimatedRevenueLoss: '1',
            estimatedGrossLoss: '2',
            divisions: ['E4P']
        }];
        const result = consolidateTicketsById(tickets);
        expect(result).to.be.eql([{
            id: 'INC-0002,INC-0003',
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


describe('buildTicketLinks', () => {
    it('return href link for each id and url passed', () => {
        expect(buildTicketLinks('INC1234,INC5678', '', 'www.expedia.com/,www.vrbo.com/')).to.be.eql(
            <div>
                <div><a href="www.expedia.com/" target="_blank">{'INC1234'}</a></div>
                <div><a href="www.vrbo.com/" target="_blank">{'INC5678'}</a></div>
            </div>
        );
    });
});

describe('buildTicketLink', () => {
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
            id: 'INC1999',
            duration: '1 hour',
            timeToDetect: '10 minutes',
            timeToResolve: '50 minutes'
        };
        expect(mapEpsData(data)).to.eql({
            id: 'INC1999',
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
            incidentNumber: 'INC1999',
            duration: 30000,
            timeToDetect: 20000,
            timeToResolve: 10000
        };
        expect(mapEpsData(data)).to.eql({
            incidentNumber: 'INC1999',
            brand: EXPEDIA_PARTNER_SERVICES_BRAND,
            impactedBrand: EXPEDIA_PARTNER_SERVICES_BRAND,
            duration: data.duration,
            timeToDetect: data.timeToDetect,
            timeToResolve: data.timeToResolve,
            impactedPartners: null,
            impactedPartnersLobs: null
        });
    });
    it('merged ids when given more than one', () => {
        const data = {
            id: 'EPS-0001',
            incidentNumber: 'INC1234567',
            duration: 30000,
            timeToDetect: 20000,
            timeToResolve: 10000
        };
        expect(mapEpsData(data)).to.eql({
            id: 'EPS-0001,INC1234567',
            incidentNumber: 'INC1234567',
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

describe('getBrand()', () => {
    it('finds the correct values for the changeRequests', () => {
        expect(getBrand(EG_BRAND, 'label').changeRequests).to.be.eql('');
        expect(getBrand(VRBO_BRAND, 'label').changeRequests).to.be.eql('HomeAway');
        expect(getBrand(EGENCIA_BRAND, 'label').changeRequests).to.be.eql('Egencia EU,Egencia NA');
        expect(getBrand(EXPEDIA_BRAND, 'label').changeRequests).to.be.eql('Expedia');
        expect(getBrand(HOTELS_COM_BRAND, 'label').changeRequests).to.be.eql('Hotels');
    });
});

describe('adjustInputValue()', () => {
    it('returns empty array if input undefined', () => {
        const result = adjustInputValue();
        expect(result).to.be.eql([]);
    });

    it('returns array with value as array', () => {
        const mockArray = [{key: 'productName', value: 'Acquisition'},
            {key: 'applicationName', value: 'air-orderstore'},
            {key: 'applicationName', value: 'airchangeservice'}];
        const mockResult = [{key: 'productName', values: ['Acquisition']},
            {key: 'applicationName', values: ['air-orderstore', 'airchangeservice']}];
        const result = adjustInputValue(mockArray);
        expect(result).to.be.eql(mockResult);
    });

    it('returns empty array if array in input do not have key value format elements', () => {
        const mockArray = [{keys: 'productName', value: 'Acquisition'}];
        const result = adjustInputValue(mockArray);
        expect(result).to.be.eql([]);
    });
});

describe('addSuggestionType()', () => {
    const serviceTiers = ['Tier 1', 'Tier 2', 'Tier 3'];
    const productNames = ['testName'];
    const suggestions = {
        productName: productNames,
        applicationName: [],
        incidentPriority: [],
        incidentStatus: []
    };

    it('returns updates suggestions if no property', () => {
        const result = addSuggestionType(suggestions, 'serviceTier', serviceTiers);
        expect(result.serviceTier).to.be.eql(serviceTiers);
    });

    it('returns unchanged suggestions if property already exists', () => {
        const result = addSuggestionType(suggestions, 'productName', productNames);
        expect(result.productName[0]).to.be.eql(productNames[0]);
    });
});

describe('getAnnotationsFilter()', () => {
    const tickets = [{
        brand: 'Brand Expedia',
        bucketTime: '2020-09-21 14:18',
        businessJustification: 'Automated Deployment',
        businessReason: 'Upgrade',
        category: 'deployment',
        serviceTier: 'Tier 1',
        tags: ['LX Shopping', 'Expedia'],
        teamContactDL: 'lxshop@expedia.com',
        teamName: 'LX',
        time: '2020-09-21 14:18',
        serviceName: 'test-service-name'
    }, {
        brand: 'Brand Expedia',
        bucketTime: '2020-09-21 14:21',
        businessJustification: 'Automated Deployment',
        businessReason: 'Upgrade',
        category: 'deployment',
        serviceName: 'test-service',
        serviceTier: 'Tier 1',
        teamContactDL: 'lxshop@expedia.com',
        teamName: 'LX',
        time: '2020-09-21 14:21'
    }, {
        brand: 'eCommerce Platform',
        bucketTime: '2020-09-21 12:13',
        businessJustification: 'Automated Deployment',
        businessReason: 'Upgrade',
        category: 'deployment',
        serviceTier: 'Tier 2',
        teamContactDL: 'FlightCrewNotifications@expedia.com',
        teamName: 'Air P&C',
        time: '2020-09-21 12:13',
        serviceName: 'Activities-Web'
    }];

    it('returns properly filtered tickets', () => {
        const result = tickets.filter(getAnnotationsFilter(['Tier 1'], 'serviceTier'));
        expect(result.length).to.be.eql(2);
    });

    it('returns empty array when filter does not match', () => {
        const result = tickets.filter(getAnnotationsFilter(['Tier 3'], 'serviceTier'));
        expect(result.length).to.be.eql(0);
    });

    it('returns proper result with the toLowerCase param set to true', () => {
        const result = tickets.filter(getAnnotationsFilter(['activities-web'], 'serviceName', true));
        expect(result.length).to.be.eql(1);
    });
});

describe('filterNewSelectedItems()', () => {
    const adjustedInputValue = [{
        key: 'serviceTier',
        values: ['Tier 3']
    }, {
        key: 'productName',
        values: ['Core Services']
    }];

    it('returns correct filter option', () => {
        const result = filterNewSelectedItems(adjustedInputValue, 'productName');
        expect(result[0]).to.be.eql('Core Services');
    });
});

describe('bucketTime()', () => {
    const PAGE_VIEWS_DATE_FORMAT = 'YYYY-MM-DD HH:mm';

    it('returns date for the specified format if the interval is less than 24h', () => {
        const date = '2020-10-02 07:27:04.0000000';
        const startDate = moment('2020-10-01 07:27:04');
        const endDate = moment('2020-10-01 13:27:04');
        const result = bucketTime(date, PAGE_VIEWS_DATE_FORMAT, startDate, endDate);
        expect(result).to.be.eql('2020-10-02 07:27');
    });

    it('returns date rounded to the 10 minutes if the interval is > 24h', () => {
        const date = '2020-10-02 07:27:04.0000000';
        const startDate = moment('2020-10-01 07:27:04');
        const endDate = moment('2020-10-02 13:27:04');
        const result = bucketTime(date, PAGE_VIEWS_DATE_FORMAT, startDate, endDate);
        expect(result).to.be.eql('2020-10-02 07:20');
    });

    it('returns date rounded to the hour if the interval is > 7days', () => {
        const date = '2020-10-02 07:27:04.0000000';
        const startDate = moment('2020-09-01 15:27:04');
        const endDate = moment('2020-10-01 13:27:04');
        const result = bucketTime(date, PAGE_VIEWS_DATE_FORMAT, startDate, endDate);
        expect(result).to.be.eql('2020-10-02 07:00');
    });

    it('returns date rounded to the hour if the startDate is older 90 days', () => {
        const date = '2020-10-02 07:27:04.0000000';
        const startDate = moment('2020-03-01 15:27:04');
        const endDate = moment('2020-10-01 13:27:04');
        const result = bucketTime(date, PAGE_VIEWS_DATE_FORMAT, startDate, endDate);
        expect(result).to.be.eql('2020-10-02 07:00');
    });

    it('returns date rounded to the day if the startDate is older 365 days', () => {
        const date = '2020-10-02 07:27:04.0000000';
        const startDate = moment('2019-09-01 15:27:04');
        const endDate = moment('2020-10-01 13:27:04');
        const result = bucketTime(date, PAGE_VIEWS_DATE_FORMAT, startDate, endDate);
        expect(result).to.be.eql('2020-10-02 00:00');
    });
});

describe('makeSuccessRatesObjects()', () => {
    const start = moment('2020-08-10');
    const end = moment('2020-08-11');
    it('creates an array with one element for each page view in PAGES_LIST', () => {
        expect(makeSuccessRatesObjects([[], [], [], []], start, end, EXPEDIA_BRAND, EXPEDIA_BRAND)).to.have.length(SUCCESS_RATES_PAGES_LIST.length);
    });

    it('returns array with objects if no inputs are passed', () => {
        const emptyPageViewsMockResults = [{'aggregatedData': [], 'minValue': 0, 'pageBrand': '', 'pageName': 'Home To Search Page (SERP)'}, {'aggregatedData': [], 'minValue': 0, 'pageBrand': '', 'pageName': 'Search (SERP) To Property Page (PDP)'}, {'aggregatedData': [], 'minValue': 0, 'pageBrand': '', 'pageName': 'Property (PDP) To Checkout Page (CKO)'}, {'aggregatedData': [], 'minValue': 0, 'pageBrand': '', 'pageName': 'Checkout (CKO) To Checkout Confirmation Page'}];

        expect(makeSuccessRatesObjects()).to.eql(emptyPageViewsMockResults);
    });

    it('creates an array with each object and the expected format', () => {
        const pageViewsMockResults = [
            {'aggregatedData': [], 'minValue': 92.96, 'pageBrand': 'Expedia', 'pageName': 'Home To Search Page (SERP)'},
            {'aggregatedData': [], 'minValue': 92.96, 'pageBrand': 'Expedia', 'pageName': 'Search (SERP) To Property Page (PDP)'},
            {'aggregatedData': [], 'minValue': 92.96, 'pageBrand': 'Expedia', 'pageName': 'Property (PDP) To Checkout Page (CKO)'},
            {'aggregatedData': [], 'minValue': 92.96, 'pageBrand': 'Expedia', 'pageName': 'Checkout (CKO) To Checkout Confirmation Page'}
        ];

        expect(makeSuccessRatesObjects(successRatesMockData, start, end, EXPEDIA_BRAND, EXPEDIA_BRAND)).to.eql(pageViewsMockResults);
    });
});
