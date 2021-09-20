import React from 'react';
import {expect} from 'chai';
import moment from 'moment';
import {
    getTableColumns,
    adjustTicketProperties,
    getIncidentsData,
    sumPropertyInArrayOfObjects,
    incidentsOfTheWeek,
    getIncMetricsByBrand,
    getWeeks,
    getMeanValue,
    getMeanHours,
    weeklyMTTRMTTD,
    weeklyMeanTimebyBrand
} from '../incidentsHelper';
import {EG_BRAND, EXPEDIA_PARTNER_SERVICES_BRAND, VRBO_BRAND, EXPEDIA_BRAND} from '../../../constants';
import mockData from './filteredIncidents.test.json';
import mockData2 from './incData.test.json';

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
                'Incident', 'Priority', 'Division', 'Started', 'Summary', 'Impacted Partners', 'RC Owner', 'TTD', 'TTK', 'TTF', 'TTR', 'Notification Sent', 'Status'
            ]);
        });

        it('returns correct columns for EG brand', () => {
            expect(getTableColumns(EG_BRAND)).to.eql([
                'Incident', 'Priority', 'Brand', 'Division', 'Started', 'Summary', 'RC Owner', 'TTD', 'TTK', 'TTF', 'TTR', 'Status'
            ]);
        });

        it('returns correct columns for non-EPS and non-EG brand', () => {
            expect(getTableColumns(VRBO_BRAND)).to.eql([
                'Incident', 'Priority', 'Division', 'Started', 'Summary', 'RC Owner', 'TTD', 'TTK', 'TTF', 'TTR', 'Status'
            ]);
        });
    });

    describe('adjustTicketProperties', () => {
        it('maps incidents correctly', () => {
            const ticketA = {
                summary: 'summary',
                time_to_resolve: '20000',
                start_date: '2020-01-01',
                divisions: ['E4P', 'Other'],
                status: 'To Do',
                root_cause_owner: 'owner',
                brand: 'VRBO',
                impacted_brand: 'vrbo,EPS,EPS',
                impacted_partners_lobs: 'CHASE-Air',
                notification_sent: 'chase'
            };
            const ticketB = {
                summary: 'summary',
                time_to_resolve: '2 hours 2 minutes',
                open_date: '2020-01-02',
                status: 'To DO',
                root_cause_owner: 'owner',
                brand: 'other',
                impacted_brand: 'other',
                impacted_partners_lobs: 'CHASE-Air',
                notification_sent: 'chase'
            };
            expect(adjustTicketProperties([ticketA, ticketB], 'incident')).to.eql([
                Object.assign(ticketA, {
                    start_date: ticketA.start_date,
                    time_to_resolve: ticketA.time_to_resolve,
                    Division: 'E4P,Other',
                    Status: ticketA.status,
                    'RC Owner': ticketA.root_cause_owner,
                    Brand: `${VRBO_BRAND}, ${EXPEDIA_PARTNER_SERVICES_BRAND}`,
                    partner_divisions: ticketA.divisions,
                    'Impacted Partners': ticketA.impacted_partners_lobs,
                    'Notification Sent': ticketA.notification_sent
                }), Object.assign(ticketB, {
                    start_date: ticketB.open_date,
                    time_to_resolve: ticketB.time_to_resolve,
                    Division: ticketB.brand,
                    Status: ticketB.status,
                    'RC Owner': ticketB.root_cause_owner,
                    Brand: EXPEDIA_BRAND,
                    partner_divisions: ticketB.divisions,
                    'Impacted Partners': ticketB.impacted_partners_lobs,
                    'Notification Sent': ticketB.notification_sent
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

    describe('getWeeks', () => {
        it('returns array of starting weeks given start and end date', () => {
            expect(getWeeks('2020-08-01', '2020-08-07')).to.be.eql(['2020-07-26', '2020-08-02']);
        });
        it('returns array of starting weeks given start and end date - inclusive boundary', () => {
            expect(getWeeks('2020-07-26', '2020-08-09')).to.be.eql(['2020-07-26', '2020-08-02', '2020-08-09']);
        });
    });

    describe('getMeanValue', () => {
        it('returns mean value', () => {
            const property = 'time_to_resolve';
            const incidents = [
                {[property]: 360000},
                {[property]: 720000}
            ];
            expect(getMeanValue(incidents, property)).to.be.eql(incidents.reduce((acc, curr) => curr[property] + acc, 0) / incidents.length);
        });
    });

    describe('getMeanHours', () => {
        it('returns mean hours given valid date range', () => {
            const property = 'time_to_resolve';
            const date = '2020-08-02';
            const incidents = [
                {start_date: '2020-08-07', [property]: 3600000},
                {start_date: '2020-08-08', [property]: 7200000}
            ];
            expect(getMeanHours(incidents, date, property)).to.be.eql(
                incidents.reduce((acc, curr) => curr[property] + acc, 0) / incidents.length / 3600000);
        });
        it('returns mean hours and ignores those outside date range', () => {
            const property = 'time_to_resolve';
            const date = '2020-08-02';
            const incidents = [
                {start_date: '2020-08-07', [property]: 3600000},
                {start_date: '2020-09-08', [property]: 7200000}
            ];
            expect(getMeanHours(incidents, date, property)).to.be.eql(incidents[0][property] / 3600000);
        });
    });

    describe('weeklyMTTRMTTD', () => {
        it('returns MTTR and MTTD for given date range and array of incidents bucketed by week', () => {
            const incidents = [
                {start_date: '2020-07-23T12:00:00Z', time_to_resolve: '1100000', time_to_detect: '80000'},
                {start_date: '2020-08-03T12:00:00Z', time_to_resolve: '200000', time_to_detect: '50000'},
                {start_date: '2020-08-03T12:00:00Z', time_to_resolve: '500000', time_to_detect: '10000'},
                {start_date: '2020-08-10T12:00:00Z', time_to_resolve: '60000', time_to_detect: '30000'},
                {start_date: '2020-08-23T12:00:00Z', time_to_resolve: '1100000', time_to_detect: '100000'},
            ];
            expect(weeklyMTTRMTTD('2020-08-02', '2020-08-09', incidents)).to.be.eql({
                data: [{
                    name: '2020-08-02',
                    MTTR: Number(moment.duration((200000 + 500000) / 2, 'milliseconds').as('hours').toFixed(2)),
                    MTTD: Number(moment.duration((50000 + 10000) / 2, 'milliseconds').as('hours').toFixed(2))
                }, {
                    name: '2020-08-09',
                    MTTR: Number(moment.duration(60000, 'milliseconds').as('hours').toFixed(2)),
                    MTTD: Number(moment.duration(30000, 'milliseconds').as('hours').toFixed(2))
                }],
                keys: ['MTTR', 'MTTD']
            });
        });
    });

    describe('weeklyMeanTimebyBrand', () => {
        it('returns MTTR for given date range and array of incidents bucketed by week and brand', () => {
            const incidents = [
                {Brand: 'hotels, eps', start_date: '2020-07-23T12:00:00Z', time_to_detect: '1100000'},
                {Brand: 'vrbo', start_date: '2020-08-03T12:00:00Z', time_to_detect: '200000'},
                {Brand: 'vrbo', start_date: '2020-08-03T12:00:00Z', time_to_detect: '500000'},
                {Brand: 'expedia', start_date: '2020-08-10T12:00:00Z', time_to_detect: '60000'},
                {Brand: 'expedia', start_date: '2020-08-23T12:00:00Z', time_to_detect: '1100000'},
            ];
            expect(weeklyMeanTimebyBrand('2020-08-02', '2020-08-09', incidents, EG_BRAND, 'time_to_detect')).to.be.eql({
                data: [{
                    name: '2020-08-02',
                    eps: 0,
                    hotels: 0,
                    vrbo: Number(moment.duration((200000 + 500000) / 2, 'milliseconds').as('hours').toFixed(2)),
                    expedia: 0
                }, {
                    name: '2020-08-09',
                    eps: 0,
                    hotels: 0,
                    vrbo: 0,
                    expedia: Number(moment.duration(60000, 'milliseconds').as('hours').toFixed(2)),
                }],
                keys: ['eps', 'expedia', 'hotels', 'vrbo']
            });
        });

        it('returns MTTD for given date range and array of incidents bucketed by week and brand', () => {
            const incidents = [
                {Brand: 'hotels', start_date: '2020-07-23T12:00:00Z', time_to_detect: '80000'},
                {Brand: 'vrbo', start_date: '2020-08-03T12:00:00Z', time_to_detect: '50000'},
                {Brand: 'vrbo', start_date: '2020-08-03T12:00:00Z', time_to_detect: '10000'},
                {Brand: 'expedia', start_date: '2020-08-10T12:00:00Z', time_to_detect: '30000'},
                {Brand: 'expedia', start_date: '2020-08-23T12:00:00Z', time_to_detect: '100000'},
            ];
            expect(weeklyMeanTimebyBrand('2020-08-02', '2020-08-09', incidents, EG_BRAND, 'time_to_detect')).to.be.eql({
                data: [{
                    name: '2020-08-02',
                    expedia: 0,
                    hotels: 0,
                    vrbo: Number(moment.duration((50000 + 10000) / 2, 'milliseconds').as('hours').toFixed(2))
                }, {
                    name: '2020-08-09',
                    hotels: 0,
                    vrbo: 0,
                    expedia: Number(moment.duration(30000, 'milliseconds').as('hours').toFixed(2)),
                }],
                keys: ['expedia', 'hotels', 'vrbo']
            });
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
