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
    weeklyMeanTimebyBrand,
    formatMomentInLocalDateTime,
    formatObjectFromIncident,

} from '../incidentsHelper';
import {EG_BRAND, EXPEDIA_PARTNER_SERVICES_BRAND, VRBO_BRAND, EXPEDIA_BRAND} from '../../../constants';
import filteredIncData from './filteredIncidents.test.json';
import singleIncData from './singleIncData.json'
import incData from './incData.test.json';


const dataResult = {
    'Brand': 'Expedia Partner Solutions (EPS)',
    'Duration': '<divvalue=8000>0m</div>',
    'Incident': <a href="https://expedia.service-now.com/go.do?id=INC4419505" target="_blank">{'INC4419505'}</a>,
    'Priority': '1-Critical',
    'Root Cause Owner': 'EAN Release - Deploy',
    'Status': 'Closed',
    'Summary': 'EAN Degraded',
};

describe('incidentsHelper', () => {
    describe('getTableColumns', () => {
        it('returns correct columns for EPS brand', () => {
            expect(getTableColumns(EXPEDIA_PARTNER_SERVICES_BRAND)).to.eql([
                'Incident', 'Priority', 'Division', 'Started', 'Summary', 'Impacted Partners', 'RC Owner', 'TTD', 'TTK', 'TTF', 'TTR', 'Notification Sent', 'Status', 'Success Rates', 'Page Views'
            ]);
        });

        it('returns correct columns for EG brand', () => {
            expect(getTableColumns(EG_BRAND)).to.eql([
                'Incident', 'Priority', 'Brand', 'Division', 'Started', 'Summary', 'RC Owner', 'TTD', 'TTK', 'TTF', 'TTR', 'Status', 'Success Rates', 'Page Views'
            ]);
        });

        it('returns correct columns for non-EPS and non-EG brand', () => {
            expect(getTableColumns(VRBO_BRAND)).to.eql([
                'Incident', 'Priority', 'Division', 'Started', 'Summary', 'RC Owner', 'TTD', 'TTK', 'TTF', 'TTR', 'Status', 'Success Rates', 'Page Views'
            ]);
        });
    });

    describe('adjustTicketProperties', () => {
        it('maps incidents correctly', () => {
            const ticketA = {
                summary: 'summary',
                time_to_restore: '20000',
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
                time_to_restore: '2 hours 2 minutes',
                open_date: '2020-01-02',
                status: 'To DO',
                root_cause_owner: 'owner',
                brand: 'other',
                impacted_brand: 'other',
                impacted_partners_lobs: 'CHASE-Air',
                notification_sent: 'chase'
            };
            expect(adjustTicketProperties([ticketA, ticketB])).to.eql([
                Object.assign(ticketA, {
                    start_date: ticketA.start_date,
                    time_to_restore: ticketA.time_to_restore,
                    Division: 'E4P,Other',
                    Status: ticketA.status,
                    'RC Owner': ticketA.root_cause_owner,
                    Brand: `${VRBO_BRAND}, ${EXPEDIA_PARTNER_SERVICES_BRAND}`,
                    partner_divisions: ticketA.divisions,
                    'Impacted Partners': ticketA.impacted_partners_lobs,
                    'Notification Sent': ticketA.notification_sent,
                    duration: ''
                }), Object.assign(ticketB, {
                    start_date: ticketB.open_date,
                    time_to_restore: ticketB.time_to_restore,
                    Division: ticketB.brand,
                    Status: ticketB.status,
                    'RC Owner': ticketB.root_cause_owner,
                    Brand: EXPEDIA_BRAND,
                    partner_divisions: ticketB.divisions,
                    'Impacted Partners': ticketB.impacted_partners_lobs,
                    'Notification Sent': ticketB.notification_sent,
                    duration: ''
                })]);
        });
    });

    describe('formatMomentInLocalDateTime', () => {
        it('returns formated date time from moment', () => {
            expect(formatMomentInLocalDateTime('2022-01-25 09:12:00.0000000')).to.eql('2022-01-25 09:12');
        });
        
        it('returns false if input is invalid', () => {
            expect(formatMomentInLocalDateTime('')).to.eql(false);
        });

        it('returns false if input is null', () => {
            expect(formatMomentInLocalDateTime(null)).to.eql(false);
        });
    });

    describe('formatObjectFromIncident', () => {
        it('returns default (-) if input is empty', () => {
            const result = formatObjectFromIncident({});
            const defaultObject = {
                "Booking Impact": "-",
                "Description": "-",
                "Environment": "-",
                "Executive Summary": "-",
                "ID": "-",
                "L1": "-",
                "Priority": "-",
                "RC Owner": "-",
                "Resolution Notes": "-",
                "Started": "-",
                "TTD": "-",
                "TTF": "-",
                "TTK": "-",
                "TTR": "-",
                }
            expect(result).to.be.eql(defaultObject);
        });

        it('returns formatted incident Object from JSON response', () => {
            const result = formatObjectFromIncident(singleIncData[0])
            const incObject = {
                "Booking Impact": "Severe Booking Impact",
                "Description": "Egencia NA degraded - created by zhroberts from #noc-ege-commands-room",
                "Environment": "Production",
                "Executive Summary": "-",
                "ID": "INC5997738",
                "L1": "Egencia - Consolidated",
                "Priority": "1-Critical",
                "RC Owner": "Egencia - Payments",
                "Resolution Notes": "Service was restored without any technical intervention by support team.  Egencia Payment Team will lead root cause investigation.",
                "Started": "2021-11-10 07:36",
                "TTD": "11m",
                "TTF": "0m",
                "TTK": "6m",
                "TTR": "17m",
                }
            expect(result).to.be.eql(incObject)
        })
    });
    

    describe('getIncidentsData', () => {
        it('returns empty array if filteredIncidents is not passed', () => {
            const result = getIncidentsData();
            expect(result).to.be.eql([]);
        });

        it('returns array populated if filteredIncidents are passed', () => {
            const result = getIncidentsData([filteredIncData[0]]);
            expect(result[0].Brand).to.be.eql(dataResult.Brand);
            expect(result[0].Duration.toString().replace(/\s/g, '')).to.be.eql(dataResult.Duration);
            expect(result[0].Incident).to.be.eql(dataResult.Incident);
            expect(result[0].Priority).to.be.eql(dataResult.Priority);
            expect(result[0].Status).to.be.eql(dataResult.Status);
            expect(result[0].Summary).to.be.eql(dataResult.Summary);
            expect(result[0]['Root Cause Owner']).to.be.eql(dataResult['Root Cause Owner']);
        });

        it('returns empty string when values are null', () => {
            const result = getIncidentsData([filteredIncData[1]]);
            expect(result[0]['Root Cause Owner']).to.be.eql('-');
            expect(result[0].Summary).to.be.eql('-');
            expect(result[0].Duration).to.be.eql('-');
            expect(result[0].Status).to.be.eql('-');
            expect(result[0].Priority).to.be.eql('-');
        });
    });

    describe('getIncMetricsByBrand', () => {
        it('returns array with metrics by Brand for a given array of incidents', () => {
            const result = getIncMetricsByBrand(incData);
            expect(result).to.be.eql([
                {
                    'Brand': 'Expedia Partner Solutions (EPS)',
                    'MTTR': '0m',
                    'MTTD': '0m',
                    'P1': 1,
                    'P2': 1,
                    'All': 2,
                    'Total Duration': '3m'
                },
                {
                    'Brand': 'eCommerce Platform (eCP)',
                    'MTTR': '2m',
                    'MTTD': '2m',
                    'P1': 0,
                    'P2': 2,
                    'All': 2,
                    'Total Duration': '10m'
                }
            ]);
        });

        it('returns empty array if input is empty', () => {
            const result = getIncMetricsByBrand([]);
            expect(result).to.be.eql([]);
        });
    });

    describe('totalDuration', () => {
        it('returns the total duration of a given array of incidents', () => {
            const result = sumPropertyInArrayOfObjects(incData, 'duration');
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
            const property = 'time_to_restore';
            const incidents = [
                {[property]: 360000},
                {[property]: 720000}
            ];
            expect(getMeanValue(incidents, property)).to.be.eql(incidents.reduce((acc, curr) => curr[property] + acc, 0) / incidents.length);
        });
    });

    describe('getMeanHours', () => {
        it('returns mean hours given valid date range', () => {
            const property = 'time_to_restore';
            const date = '2020-08-02';
            const incidents = [
                {start_date: '2020-08-07', [property]: 60},
                {start_date: '2020-08-08', [property]: 90}
            ];
            expect(getMeanHours(incidents, date, property)).to.be.eql(
                incidents.reduce((acc, curr) => curr[property] + acc, 0) / incidents.length / 60);
        });
        it('returns mean hours and ignores those outside date range', () => {
            const property = 'time_to_restore';
            const date = '2020-08-02';
            const incidents = [
                {start_date: '2020-08-07', [property]: 60},
                {start_date: '2020-09-08', [property]: 90}
            ];
            expect(getMeanHours(incidents, date, property)).to.be.eql(incidents[0][property] / 60);
        });
    });

    describe('weeklyMTTRMTTD', () => {
        it('returns MTTR and MTTD for given date range and array of incidents bucketed by week', () => {
            const incidents = [
                {start_date: '2020-07-23T12:00:00Z', time_to_restore: '18', time_to_detect: '1'},
                {start_date: '2020-08-03T12:00:00Z', time_to_restore: '3', time_to_detect: '1'},
                {start_date: '2020-08-03T12:00:00Z', time_to_restore: '8', time_to_detect: '0'},
                {start_date: '2020-08-10T12:00:00Z', time_to_restore: '1', time_to_detect: '1'},
                {start_date: '2020-08-23T12:00:00Z', time_to_restore: '18', time_to_detect: '2'},
            ];
            expect(weeklyMTTRMTTD('2020-08-02', '2020-08-09', incidents)).to.be.eql({
                data: [{
                    name: '2020-08-02',
                    MTTR: Number(moment.duration((3 + 8) / 2, 'minutes').as('hours').toFixed(2)),
                    MTTD: Number(moment.duration((1 + 0) / 2, 'minutes').as('hours').toFixed(2))
                }, {
                    name: '2020-08-09',
                    MTTR: Number(moment.duration(1, 'minutes').as('hours').toFixed(2)),
                    MTTD: Number(moment.duration(1, 'minutes').as('hours').toFixed(2))
                }],
                keys: ['MTTR', 'MTTD']
            });
        });
    });

    describe('weeklyMeanTimebyBrand', () => {
        it('returns MTTR for given date range and array of incidents bucketed by week and brand', () => {
            const incidents = [
                {Brand: 'hotels, eps', start_date: '2020-07-23T12:00:00Z', time_to_detect: '18'},
                {Brand: 'vrbo', start_date: '2020-08-03T12:00:00Z', time_to_detect: '3'},
                {Brand: 'vrbo', start_date: '2020-08-03T12:00:00Z', time_to_detect: '8'},
                {Brand: 'expedia', start_date: '2020-08-10T12:00:00Z', time_to_detect: '7'},
                {Brand: 'expedia', start_date: '2020-08-23T12:00:00Z', time_to_detect: '18'},
            ];
            expect(weeklyMeanTimebyBrand('2020-08-02', '2020-08-09', incidents, EG_BRAND, 'time_to_detect')).to.be.eql({
                data: [{
                    name: '2020-08-02',
                    eps: 0,
                    hotels: 0,
                    vrbo: Number(moment.duration((3 + 8) / 2, 'minutes').as('hours').toFixed(2)),
                    expedia: 0
                }, {
                    name: '2020-08-09',
                    eps: 0,
                    hotels: 0,
                    vrbo: 0,
                    expedia: Number(moment.duration(7, 'minutes').as('hours').toFixed(2)),
                }],
                keys: ['eps', 'expedia', 'hotels', 'vrbo']
            });
        });

        it('returns MTTD for given date range and array of incidents bucketed by week and brand', () => {
            const incidents = [
                {Brand: 'hotels', start_date: '2020-07-23T12:00:00Z', time_to_detect: '80'},
                {Brand: 'vrbo', start_date: '2020-08-03T12:00:00Z', time_to_detect: '50'},
                {Brand: 'vrbo', start_date: '2020-08-03T12:00:00Z', time_to_detect: '10'},
                {Brand: 'expedia', start_date: '2020-08-10T12:00:00Z', time_to_detect: '30'},
                {Brand: 'expedia', start_date: '2020-08-23T12:00:00Z', time_to_detect: '100'},
            ];
            expect(weeklyMeanTimebyBrand('2020-08-02', '2020-08-09', incidents, EG_BRAND, 'time_to_detect')).to.be.eql({
                data: [{
                    name: '2020-08-02',
                    expedia: 0,
                    hotels: 0,
                    vrbo: Number(moment.duration((50 + 10) / 2, 'minutes').as('hours').toFixed(2))
                }, {
                    name: '2020-08-09',
                    hotels: 0,
                    vrbo: 0,
                    expedia: Number(moment.duration(30, 'minutes').as('hours').toFixed(2)),
                }],
                keys: ['expedia', 'hotels', 'vrbo']
            });
        });
    });

    describe('incidentsOfTheWeek', () => {
        it('returns the incidents of a specific week from an array of incidents in input', () => {
            const result = incidentsOfTheWeek(incData, 38);
            expect(result.length).to.be.eql(3);
        });

        it('returns empty array if the week is not a number', () => {
            const result = incidentsOfTheWeek(incData);
            expect(result).to.be.eql([]);
        });

        it('returns empty array if input array is empty', () => {
            const result = incidentsOfTheWeek([]);
            expect(result).to.be.eql([]);
        });
    });
});
