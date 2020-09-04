import React from 'react';
import {expect} from 'chai';
import {
    getTableColumns,
    adjustTicketProperties,
    getIncidentsData,
    sumPropertyInArrayOfObjects,
    getMarginDateValues,
    incidentsOfTheWeek,
    getIncMetricsByBrand,
    listOfIncByBrands,
    mttr
} from '../incidentsHelper';
import {EG_BRAND, EXPEDIA_PARTNER_SERVICES_BRAND, VRBO_BRAND, EXPEDIA_BRAND} from '../../../constants';
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
    describe('getTableColumns', () => {
        it('returns correct columns for EPS brand', () => {
            expect(getTableColumns(EXPEDIA_PARTNER_SERVICES_BRAND)).to.eql([
                'Incident', 'Priority', 'Division', 'Started', 'Summary', 'Impacted Partners', 'RC Owner', 'TTD', 'TTR', 'Notification Sent', 'Status'
            ]);
        });

        it('returns correct columns for EG brand', () => {
            expect(getTableColumns(EG_BRAND)).to.eql([
                'Incident', 'Priority', 'Brand', 'Division', 'Started', 'Summary', 'RC Owner', 'TTD', 'TTR', 'Status'
            ]);
        });

        it('returns correct columns for non-EPS and non-EG brand', () => {
            expect(getTableColumns(VRBO_BRAND)).to.eql([
                'Incident', 'Priority', 'Division', 'Started', 'Summary', 'RC Owner', 'TTD', 'TTR', 'Status'
            ]);
        });
    });

    describe('adjustTicketProperties', () => {
        it('maps incidents correctly', () => {
            const ticketA = {
                summary: 'summary',
                timeToResolve: '20000',
                startDate: '2020-01-01',
                divisions: ['E4P', 'Other'],
                status: 'To Do',
                rootCauseOwner: 'owner',
                brand: 'VRBO',
                impactedPartnerLobs: 'CHASE-Air',
                notificationSent: 'chase'
            };
            const ticketB = {
                summary: 'summary',
                timeToResolve: '2 hours 2 minutes',
                openDate: '2020-01-02',
                status: 'To DO',
                rootCauseOwner: 'owner',
                brand: 'other',
                impactedPartnerLobs: 'CHASE-Air',
                notificationSent: 'chase'
            };
            expect(adjustTicketProperties([ticketA, ticketB], 'incident')).to.eql([
                Object.assign(ticketA, {
                    startDate: ticketA.startDate,
                    timeToResolve: ticketA.timeToResolve,
                    Division: 'E4P,Other',
                    Status: ticketA.status,
                    'RC Owner': ticketA.rootCauseOwner,
                    Brand: VRBO_BRAND,
                    partner_divisions: ticketA.divisions,
                    'Impacted Partners': ticketA.impactedPartnersLobs,
                    'Notification Sent': ticketA.notificationSent
                }), Object.assign(ticketB, {
                    startDate: ticketB.openDate,
                    timeToResolve: ticketB.timeToResolve,
                    Division: ticketB.brand,
                    Status: ticketB.status,
                    'RC Owner': ticketB.rootCauseOwner,
                    Brand: EXPEDIA_BRAND,
                    partner_divisions: ticketB.divisions,
                    'Impacted Partners': ticketB.impactedPartnersLobs,
                    'Notification Sent': ticketB.notificationSent
                })]);
        });
    });

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
