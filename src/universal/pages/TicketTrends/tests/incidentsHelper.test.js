import React from 'react';
import {expect} from 'chai';
import {
    getIncidentsData,
    sumPropertyInArrayOfObjects,
    getMarginDateValues,
    incidentsOfTheWeek,
    getIncMetricsByBrand,
    listOfIncByBrands,
    mttr
} from '../incidentsHelper';
import mockData from './filteredData.test.json';
import mockData2 from './incData.test.json';
import mockResult from './incByBrandResult.test.json';

const dataResult = {
    'Brand': 'Expedia Partner Solutions (EPS)',
    'Duration': '<divvalue=8000>0m</div>',
    'Incident': <a href="https://expedia.service-now.com/go.do?id=INC4419505" target="_blank">{'INC4419505'}</a>,
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
});
