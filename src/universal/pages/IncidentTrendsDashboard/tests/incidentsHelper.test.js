import {expect} from 'chai';
import h from '../incidentsHelper';
import mockData from './filteredData.test.json';
import mockData2 from './incData.test.json';
import mockResult from './incByBrandResult.test.json';

const dataResult = {
    'Brand': 'Expedia Partner Solutions (EPS)',
    'Duration': "<a name='0.13333333333333333'></a>a few seconds",
    'Incident': "<a key='INC4419505link' href='https://expedia.service-now.com/go.do?id=INC4419505' target='_blank'>INC4419505</a>",
    'Priority': '1-Critical',
    'Root Cause Owners': 'EAN Release - Deploy',
    'Status': 'Closed',
    'Summary': 'EAN Degraded',
};

const durationByBrandResult = [
    {
        'Brand': 'Expedia Partner Solutions (EPS)',
        'totalDuration': 200000,
    },
    {
        'Brand': 'eCommerce Platform (eCP)',
        'totalDuration': 600000,
    }
];

const incMetricsByBrand = [
    {
        'Brand': 'Expedia Partner Solutions (EPS)',
        'MTTR': '0h 0m ',
        'MTTD': '0h 0m ',
        'P1': 1,
        'P2': 1,
        'Total': 2,
        'Total Duration': '0h 3m '
    },
    {
        'Brand': 'eCommerce Platform (eCP)',
        'MTTR': '0h 2m ',
        'MTTD': '0h 2m ',
        'P1': 0,
        'P2': 2,
        'Total': 2,
        'Total Duration': '0h 10m '
    }
];

describe('incidentsHelper', () => {
    describe('getIncidentsData', () => {
        it('returns empty array if filteredIncidents is not passed', () => {
            const result = h.getIncidentsData();
            expect(result).to.be.eql([]);
        });

        it('returns array populated if filteredIncidents are passed', () => {
            const result = h.getIncidentsData([mockData[0]]);
            expect(result[0].Brand).to.be.eql(dataResult.Brand);
            expect(result[0].Duration).to.be.eql(dataResult.Duration);
            expect(result[0].Incident).to.be.eql(dataResult.Incident);
            expect(result[0].Priority).to.be.eql(dataResult.Priority);
            expect(result[0].Status).to.be.eql(dataResult.Status);
            expect(result[0].Summary).to.be.eql(dataResult.Summary);
            expect(result[0]['Root Cause Owners']).to.be.eql(dataResult['Root Cause Owners']);
        });

        it('returns empty string when values are null', () => {
            const result = h.getIncidentsData([mockData[1]]);
            expect(result[0]['Root Cause Owners']).to.be.eql('');
            expect(result[0].Summary).to.be.eql('');
            expect(result[0].Duration).to.be.eql('');
            expect(result[0].Status).to.be.eql('');
            expect(result[0].Priority).to.be.eql('');
        });
    });

    describe('totalDurationByBrand', () => {
        it('returns array with brand and totalDuration for a given array of incidents', () => {
            const result = h.totalDurationByBrand(mockData2);
            expect(result).to.be.eql(durationByBrandResult);
        });

        it('returns empty array if input is empty', () => {
            const result = h.totalDurationByBrand([]);
            expect(result).to.be.eql([]);
        });
    });

    describe('getIncMetricsByBrand', () => {
        it('returns array with metrics by Brand for a given array of incidents', () => {
            const result = h.getIncMetricsByBrand(mockData2);
            expect(result).to.be.eql(incMetricsByBrand);
        });

        it('returns empty array if input is empty', () => {
            const result = h.getIncMetricsByBrand([]);
            expect(result).to.be.eql([]);
        });
    });

    describe('listOfIncByBrands', () => {
        it('returns array with brand and totalDuration for a given array of incidents', () => {
            const result = h.listOfIncByBrands(mockData2);
            expect(result).to.be.eql(mockResult);
        });

        it('returns empty array if input is empty', () => {
            const result = h.listOfIncByBrands([]);
            expect(result).to.be.eql([]);
        });
    });

    describe('totalDuration', () => {
        it('returns the total duration of a given array of incidents', () => {
            const result = h.totalDuration(mockData2);
            expect(result).to.be.eql(800000);
        });

        it('returns 0 if input array is empty', () => {
            const result = h.totalDuration([]);
            expect(result).to.be.eql(0);
        });
    });

    describe('mttr', () => {
        it('returns the MTTR of a given array of incidents', () => {
            const result = h.mttr(mockData2);
            expect(result).to.be.eql(100000);
        });

        it('returns 0 if input array is empty', () => {
            const result = h.mttr([]);
            expect(result).to.be.eql(0);
        });
    });

    describe('incidentsInTimeFrame', () => {
        it('returns the list of incidents started in a specified timeframe for a given array of incidents', () => {
            const startDate = '2019-09-21';
            const endDate = '2019-09-26';
            const result = h.incidentsInTimeFrame(mockData2, startDate, endDate);
            expect(result.length).to.be.eql(2);
        });

        it('returns empty array if input array is empty', () => {
            const result = h.incidentsInTimeFrame([], '', '');
            expect(result).to.be.eql([]);
        });

        it('assigns default values to endDate and startDate if not specified', () => {
            const startDate = undefined;
            const endDate = '2019-09-22';
            let result = h.incidentsInTimeFrame(mockData2, startDate, endDate);
            expect(result.length).to.be.eql(3);
            result = h.incidentsInTimeFrame(mockData2, startDate, startDate);
            expect(result.length).to.be.eql(4);
        });

        it('returns the list of incidents of a specific day', () => {
            const startDate = '2019-09-21';
            const endDate = '2019-09-21';
            const result = h.incidentsInTimeFrame(mockData2, startDate, endDate);
            expect(result.length).to.be.eql(1);
        });
    });

    describe('weeksInterval', () => {
        it('returns the min and max week of a given array of incidents', () => {
            const result = h.weeksInterval(mockData2);
            expect(result).to.be.eql([38, 39]);
        });

        it('returns empty array if input array is empty', () => {
            const result = h.weeksInterval([]);
            expect(result).to.be.eql([]);
        });
    });

    describe('datesInterval', () => {
        it('returns the min and max dates of a given array of incidents', () => {
            const result = h.datesInterval(mockData2);
            expect(result).to.be.eql(['2019-09-20', '2019-09-25']);
        });

        it('returns empty array if input array is empty', () => {
            const result = h.datesInterval([]);
            expect(result).to.be.eql([]);
        });
    });

    describe('incidentsOfTheWeek', () => {
        it('returns the incidents of a specific week from an array of incidents in input', () => {
            const result = h.incidentsOfTheWeek(mockData2, 38);
            expect(result.length).to.be.eql(3);
        });

        it('returns empty array if the week is not a number', () => {
            const result = h.incidentsOfTheWeek(mockData2);
            expect(result).to.be.eql([]);
        });

        it('returns empty array if input array is empty', () => {
            const result = h.incidentsOfTheWeek([]);
            expect(result).to.be.eql([]);
        });
    });
});