import {expect} from 'chai';
import {
    getUniqueTickets,
    getListOfUniqueProperties,
    getIncidentsData,
    sumPropertyInArrayOfObjects,
    getMarginDateValues,
    incidentsOfTheWeek,
    getIncMetricsByBrand,
    listOfIncByBrands,
    divisionToBrand,
    mttr
} from '../incidentsHelper';
import mockData from './filteredData.test.json';
import mockData2 from './incData.test.json';
import mockResult from './incByBrandResult.test.json';
import {VRBO_BRAND, HOTELS_COM_BRAND, EXPEDIA_BRAND, EGENCIA_BRAND} from '../../../constants';

const dataResult = {
    'Brand': 'Expedia Partner Solutions (EPS)',
    'Duration': '<divvalue=8000>0m</div>',
    'Incident': '<a href="https://expedia.service-now.com/go.do?id=INC4419505" target="_blank">INC4419505</a>',
    'Priority': '1-Critical',
    'Root Cause Owner': 'EAN Release - Deploy',
    'Status': 'Closed',
    'Summary': 'EAN Degraded',
};

const incMetricsByBrand = [
    {
        'Brand': 'Expedia Partner Solutions (EPS)',
        'MTTR': '0h 0m ',
        'MTTD': '0h 0m ',
        'P1': 1,
        'P2': 1,
        'All': 2,
        'Total Duration': '0h 3m '
    },
    {
        'Brand': 'eCommerce Platform (eCP)',
        'MTTR': '0h 2m ',
        'MTTD': '0h 2m ',
        'P1': 0,
        'P2': 2,
        'All': 2,
        'Total Duration': '0h 10m '
    }
];

describe('incidentsHelper', () => {
    describe('getIncidentsData', () => {
        it('returns empty array if filteredIncidents is not passed', () => {
            const result = getIncidentsData();
            expect(result).to.be.eql([]);
        });

        it('returns array populated if filteredIncidents are passed', () => {
            const result = getIncidentsData([mockData[0]]);
            expect(result[0].Brand).to.be.eql(dataResult.Brand);
            expect(result[0].Duration.toString().replace(/\s/g, '')).to.be.eql(dataResult.Duration);
            expect(result[0].Incident).to.be.eql(dataResult.Incident);
            expect(result[0].Priority).to.be.eql(dataResult.Priority);
            expect(result[0].Status).to.be.eql(dataResult.Status);
            expect(result[0].Summary).to.be.eql(dataResult.Summary);
            expect(result[0]['Root Cause Owner']).to.be.eql(dataResult['Root Cause Owner']);
        });

        it('returns empty string when values are null', () => {
            const result = getIncidentsData([mockData[1]]);
            expect(result[0]['Root Cause Owner']).to.be.eql('-');
            expect(result[0].Summary).to.be.eql('-');
            expect(result[0].Duration).to.be.eql('-');
            expect(result[0].Status).to.be.eql('-');
            expect(result[0].Priority).to.be.eql('-');
        });
    });

    describe('getIncMetricsByBrand', () => {
        it('returns array with metrics by Brand for a given array of incidents', () => {
            const result = getIncMetricsByBrand(mockData2);
            expect(result).to.be.eql(incMetricsByBrand);
        });

        it('returns empty array if input is empty', () => {
            const result = getIncMetricsByBrand([]);
            expect(result).to.be.eql([]);
        });
    });

    describe('listOfIncByBrands', () => {
        it('returns array with brand and totalDuration for a given array of incidents', () => {
            const result = listOfIncByBrands(mockData2);
            expect(result).to.be.eql(mockResult);
        });

        it('returns empty array if input is empty', () => {
            const result = listOfIncByBrands([]);
            expect(result).to.be.eql([]);
        });
    });

    describe('totalDuration', () => {
        it('returns the total duration of a given array of incidents', () => {
            const result = sumPropertyInArrayOfObjects(mockData2, 'duration');
            expect(result).to.be.eql(800000);
        });

        it('returns 0 if input array is empty', () => {
            const result = sumPropertyInArrayOfObjects([], 'duration');
            expect(result).to.be.eql(0);
        });
    });

    describe('mttr', () => {
        it('returns the MTTR of a given array of incidents', () => {
            const result = mttr(mockData2);
            expect(result).to.be.eql(100000);
        });

        it('returns 0 if input array is empty', () => {
            const result = mttr([]);
            expect(result).to.be.eql(0);
        });
    });

    describe('getMarginDateValues', () => {
        it('returns the min and max dates of a given array of incidents', () => {
            const result = getMarginDateValues(mockData2);
            expect(result).to.be.eql(['2019-09-20', '2019-09-25']);
        });

        it('returns empty array if input array is empty', () => {
            const result = getMarginDateValues([]);
            expect(result).to.be.eql([]);
        });
    });

    describe('incidentsOfTheWeek', () => {
        it('returns the incidents of a specific week from an array of incidents in input', () => {
            const result = incidentsOfTheWeek(mockData2, 38);
            expect(result.length).to.be.eql(3);
        });

        it('returns empty array if the week is not a number', () => {
            const result = incidentsOfTheWeek(mockData2);
            expect(result).to.be.eql([]);
        });

        it('returns empty array if input array is empty', () => {
            const result = incidentsOfTheWeek([]);
            expect(result).to.be.eql([]);
        });
    });

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

        it('returns Hotels.com when the input value is HOTELS WORLDWIDE (HWW)', () => {
            const result = divisionToBrand('HOTELS WORLDWIDE (HWW)');
            expect(result).to.be.eql(HOTELS_COM_BRAND);
            const result2 = divisionToBrand('HCOM');
            expect(result2).to.be.eql(HOTELS_COM_BRAND);
        });

        it('returns BEX - Expedia Group as default when the input value doesn t match', () => {
            const result = divisionToBrand('random text');
            expect(result).to.be.eql(EXPEDIA_BRAND);
        });
    });

    describe('getUniqueTickets', () => {
        it('returns list of unique incidents with tag containing array of tags from multiple row same incident', () => {
            const mockRawIncidents = [{
                summary: 'test',
                id: 'INC4801211',
                tag: 'covid-19'
            },
            {
                summary: 'test',
                id: 'INC4801211',
                tag: 'jiraok'
            },
            {
                summary: 'Degraded',
                id: 'INC4808989',
                tag: 'covid-19'
            }];

            const expectedResult = [{
                summary: 'test',
                id: 'INC4801211',
                tag: ['covid-19', 'jiraok']
            },
            {
                summary: 'Degraded',
                id: 'INC4808989',
                tag: ['covid-19']
            }];

            const result = getUniqueTickets(mockRawIncidents, 'id');
            expect(result).to.be.eql(expectedResult);
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
});
