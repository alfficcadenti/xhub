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
    makeSuccessRatesObjects,
    getQueryParams,
    validDateRange,
    getLobPlaceholder,
    getTableValue,
    getUrlParam,
    checkIsDateInvalid,
    getChartDataForFutureEvents,
    getResetGraphTitle,
    DEFAULT_DAY_RANGE, mapGroupedData, checkIsContentPercentage, threeWeekComparison
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
import {successRatesMockData, deltaUserMock} from './SuccessRates/mockData';


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

describe('checkIsContentPercentage()', () => {
    it('returns positive if percent is postive', () => {
        const result = checkIsContentPercentage('26.65%');
        expect(result).to.be.eql('positive');
    });

    it('returns negative if percent is negative', () => {
        const result = checkIsContentPercentage('-26.65%');
        expect(result).to.be.eql('negative');
    });
    it('returns empty string if not a percent', () => {
        const result = checkIsContentPercentage('26.65');
        expect(result).to.be.eql('');
    });
});

describe('threeWeekComparison()', () => {
    it('returns negative threeWeekComparison if threeWeekAv is greater than bookingCount', () => {
        const result = threeWeekComparison('2132', '1999');
        expect(result).to.be.eql('-6.24%');
    });

    it('returns positive threeWeekComparison if threeWeekAv is less than bookingCount', () => {
        const result = threeWeekComparison('776', '794');
        expect(result).to.be.eql('2.32%');
    });
    it('returns null threeWeekComparison if threeWeekAv 0', () => {
        const result = threeWeekComparison('0', '5');
        expect(result).to.be.eql('null');
    });
    it('returns 0 threeWeekComparison if threeWeekAv and bookingCount are equal', () => {
        const result = threeWeekComparison('225', '225');
        expect(result).to.be.eql('0.00%');
    });
});

describe('mapGroupedData()', () => {
    describe('get new grouped data', () => {
        it('return empty object', () => {
            expect(mapGroupedData([], [])).to.be.eql([]);
        });
        it('return newBrandsGroupedData object', () => {
            expect(mapGroupedData(['brandsGroupedDataFuture'], ['brandsGroupedData'])).to.be.eql(['brandsGroupedData']);
        });
        it('return newBrandsGroupedData object', () => {
            expect(mapGroupedData(['brandsGroupedDataFuture'], [])).to.be.eql(['brandsGroupedDataFuture']);
        });
    });
});

describe('getAnnotationsFilter()', () => {
    const tickets = [{
        brand: 'Brand Expedia',
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

describe('makeSuccessRatesObjects()', () => {
    const start = moment('2020-08-10');
    const end = moment('2020-08-11');
    it('creates an array with one element for each page view in PAGES_LIST', () => {
        expect(makeSuccessRatesObjects([[], [], [], []], start, end, EXPEDIA_BRAND, EXPEDIA_BRAND)).to.have.length(SUCCESS_RATES_PAGES_LIST.length);
    });

    it('returns array with objects if no inputs are passed', () => {
        const emptyPageViewsMockResults = [
            {aggregatedData: [], minValue: 0, pageBrand: '', chartName: 'Home To Search Page (SERP)', metricName: ''},
            {aggregatedData: [], minValue: 0, pageBrand: '', chartName: 'Search (SERP) To Property Page (PDP)', metricName: ''},
            {aggregatedData: [], minValue: 0, pageBrand: '', chartName: 'Property (PDP) To Checkout Page (CKO)', metricName: ''},
            {aggregatedData: [], minValue: 0, pageBrand: '', chartName: 'Checkout (CKO) To Checkout Confirmation Page', metricName: ''}];

        expect(makeSuccessRatesObjects()).to.eql(emptyPageViewsMockResults);
    });

    it('creates an array with each object and the expected format', () => {
        const pageViewsMockResults = [
            {aggregatedData: [], minValue: 92.96, pageBrand: 'Expedia', chartName: 'Home To Search Page (SERP)', metricName: 'SearchSuccessRate'},
            {aggregatedData: [], minValue: 92.96, pageBrand: 'Expedia', chartName: 'Search (SERP) To Property Page (PDP)', metricName: 'SERPSuccessRate'},
            {aggregatedData: [], minValue: 92.96, pageBrand: 'Expedia', chartName: 'Property (PDP) To Checkout Page (CKO)', metricName: 'PDPSuccessRate'},
            {aggregatedData: [], minValue: 92.96, pageBrand: 'Expedia', chartName: 'Checkout (CKO) To Checkout Confirmation Page', metricName: 'checkoutSuccessRate'}
        ];

        expect(makeSuccessRatesObjects(successRatesMockData, start, end, EXPEDIA_BRAND, deltaUserMock)).to.eql(pageViewsMockResults);
    });
});

describe('getQueryParams()', () => {
    it('getQueryParams - valid date range', () => {
        const start = '2020-10-22T12:15:00-05:00';
        const end = '2020-10-22T12:20:00-05:00';
        const lobs = 'H,C,INVALID';
        const {initialStart, initialEnd, initialTimeRange, initialLobs} = getQueryParams(`?from=${start}&to=${end}&lobs=${lobs}`);
        expect(initialStart.isSame(start, 'hour')).to.equal(true);
        expect(initialEnd.isSame(end, 'hour')).to.equal(true);
        expect(initialTimeRange).to.equal('Custom');
        expect(initialLobs.map(({value}) => value)).to.eql(['H', 'C']);
    });

    it('getQueryParams - default', () => {
        const {initialStart, initialEnd, initialTimeRange, initialLobs} = getQueryParams('');
        expect(initialStart.isSame(moment().subtract(6, 'hours'), 'hour')).to.equal(true);
        expect(initialEnd.isSame(moment(), 'hour')).to.equal(true);
        expect(initialTimeRange).to.equal('Last 6 Hours');
        expect(initialLobs.map(({value}) => value)).to.eql([]);
    });
});

describe('validDateRange()', () => {
    it('validDateRange - valid start date and after date', () => {
        expect(validDateRange('2020-01-01', '2020-01-02')).to.be.eql(true);
    });

    it('validDateRange - invalid start date after now', () => {
        expect(validDateRange(moment().add(1, 'day').format(), moment().add(2, 'day').format())).to.be.eql(false);
    });

    it('validDateRange - invalid start date', () => {
        expect(validDateRange(moment('asdfasdf', '2020-01-01'))).to.be.eql(false);
    });

    it('validDateRange - invalid end date', () => {
        expect(validDateRange(moment('2020-01-01', 'asdfasdf'))).to.be.eql(false);
    });
});

describe('getLobPlaceholder()', () => {
    it('getLobPlaceholder should return Line of Business is loading when isLoading true', () => {
        expect(getLobPlaceholder(true)).to.be.eql('Line of Business is loading');
    });

    it('getLobPlaceholder should return Select Line of Business when isLoading false and lobWidgetsLength is true', () => {
        expect(getLobPlaceholder(false, 2)).to.be.eql('Select Line of Business');
    });

    it('getLobPlaceholder should return Select Line of Business when isLoading & lobWidgetsLength false', () => {
        expect(getLobPlaceholder(false, 0)).to.be.eql('Line of Business Data not available. Try to refresh');
    });
});

describe('getTableValue()', () => {
    it('getTableValue', () => {
        expect(getTableValue()).to.be.eql('-');
        expect(getTableValue(null, null)).to.be.eql('-');
        expect(getTableValue({a: 'hello'}, 'b')).to.be.eql('-');
        expect(getTableValue({a: 'hello'}, 'a')).to.be.eql('hello');
        expect(getTableValue({a: ''}, 'a')).to.be.eql('-');
    });
});

describe('checkIsDateInvalid()', () => {
    it('checkIsDateInvalid should return true if start time is >=5 days', () => {
        expect(checkIsDateInvalid(moment('2015-01-01'), moment())).to.be.eql(true);
    });

    it('checkIsDateInvalid should return false when end time is <5 minutes', () => {
        expect(checkIsDateInvalid(moment(), moment())).to.be.eql(false);
    });
});

describe('getChartDataForFutureEvents()', () => {
    let dateInvalid;
    const chartData = [
        {time: 123123123, 'Booking Counts': 123}
    ];
    const simplifiedPredictionData = [
        {time: 123123123, count: 123},
        {time: 123123124, count: 124}
    ];
    const chartDataForFutureEvents = [...simplifiedPredictionData];
    const simplifiedBookingsData = [
        {time: 123123123, 'Booking Counts': 566, '3 Week Avg Counts': 615},
        {time: 123123124, 'Booking Counts': 697, '3 Week Avg Counts': 761}
    ];

    beforeEach(() => {
        dateInvalid = false;
    });

    it('getChartDataForFutureEvents should return false if date is invalid', () => {
        dateInvalid = true;
        expect(getChartDataForFutureEvents(dateInvalid, chartData, simplifiedPredictionData, chartDataForFutureEvents, simplifiedBookingsData, simplifiedBookingsData)).to.be.eql(simplifiedBookingsData);
    });

    it('getChartDataForFutureEvents should return true if date is valid', () => {
        expect(getChartDataForFutureEvents(dateInvalid, chartData, simplifiedPredictionData, chartDataForFutureEvents, simplifiedBookingsData, simplifiedBookingsData)).to.be.eql([
            {time: 123123123, 'Booking Counts': 123, '3 Week Avg Counts': 615, 'Prediction Counts': 123},
            {time: 123123124, 'Booking Counts': 0, '3 Week Avg Counts': 761, 'Prediction Counts': 124}
        ]);
    });
});

describe('getResetGraphTitle()', () => {
    it('getResetGraphTitle should be unavailable if default range is selected', () => {
        expect(getResetGraphTitle(DEFAULT_DAY_RANGE)).to.be.eql('Click to reset graph to default 3 day date time range (Disabled as default range is selected)');
    });

    it('getResetGraphTitle should be unavailable if default range is selected', () => {
        expect(getResetGraphTitle(DEFAULT_DAY_RANGE - 1)).to.be.eql('Click to reset graph to default 3 day date time range');
    });
});

it('getUrlParam', () => {
    const label = 'label';
    const valueA = 'a';
    const valueB = 'b';
    expect(getUrlParam(label, valueA, valueB)).to.equal(`&${label}=${valueA}`);
    expect(getUrlParam(label, valueA, valueA)).to.equal('');
});
