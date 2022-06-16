import React from 'react';
import moment from 'moment';
import {expect} from 'chai';
import {
    getPortfoliosQuery,
    getQueryString,
    getQueryValues,
    getPropValue,
    formatDefect,
    findAndFormatTicket,
    mapPriority,
    formatBarChartData,
    formatTTRData,
    formatPriorityCountsData,
    formatDurationData,
    formatWoWData,
    groupDataByPillar,
    formatTableData,
    formatCreatedVsResolvedData,
    processTwoDimensionalIssues,
    getPanelDataUrl
} from '../utils';
import {P1_LABEL, P2_LABEL, P3_LABEL, P4_LABEL, P5_LABEL, NOT_PRIORITIZED_LABEL} from '../constants';
import {HOTELS_COM_BRAND, VRBO_BRAND, DATE_FORMAT} from '../../../constants';

describe('Quality Metrics Util', () => {
    it('getPortfoliosQuery', () => {
        expect(getPortfoliosQuery([{value: 'a'}, {value: 'b'}])).to.eql('&portfolios=a&portfolios=b');
        expect(getPortfoliosQuery([])).to.eql('');
    });

    it('getQueryString - projects', () => {
        const brand = HOTELS_COM_BRAND;
        const start = moment('06-01-21', 'MM-DD-YY');
        const end = moment('06-21-21', 'MM-DD-YY');
        const projectKeys = ['LASER'];
        expect(getQueryString(brand, projectKeys, start, end))
            .to.eql(`/quality-metrics?selectedBrand=${brand}&from=${start.toISOString()}&to=${end.toISOString()}&projectKeys=${projectKeys[0]}`);
    });

    it('getQueryValues', () => {
        const start = '2021-05-01';
        const end = '2021-06-01';
        const hcomProjectKeys = ['KES'];
        let result = getQueryValues(`https://localhost:8080/quality-metrics?selectedBrand=${HOTELS_COM_BRAND}&projectKeys=${hcomProjectKeys[0]}&from=${start}&to=${end}`, [HOTELS_COM_BRAND]);
        expect(result.initialProjectKeys).to.be.eql(hcomProjectKeys);
        expect(result.initialStart.isSame(start, 'day')).to.be.eql(true);
        expect(result.initialEnd.isSame(end, 'day')).to.be.eql(true);
        const vrboProjectKeys = ['COREAPI'];
        result = getQueryValues(`https://localhost:8080/quality-metrics?selectedBrand=${VRBO_BRAND}&projectKeys=${vrboProjectKeys[0]}&from=${start}&to=${end}`, [VRBO_BRAND]);
        expect(result.initialProjectKeys).to.be.eql(vrboProjectKeys);
        expect(result.initialStart.isSame(start, 'day')).to.be.eql(true);
        expect(result.initialEnd.isSame(end, 'day')).to.be.eql(true);
    });

    it('getPropValue', () => {
        const item = {a: 'hello', c: 0};
        expect(getPropValue(item, 'a')).to.be.eql('hello');
        expect(getPropValue(item, 'b')).to.be.eql('-');
        expect(getPropValue(item, 'c')).to.be.eql(0);
    });

    it('formatDefect', () => {
        const defect = {
            defectNumber: 'PM-1001',
            summary: 'summary',
            priority: 'priority',
            status: 'Done',
            resolution: 'resolution',
            openDate: '2020-01-02',
            url: 'https://jira.hcom/browse/PM-1001',
            daysToResolve: 2,
            timeToResolve: 3
        };
        const formattedDefect = {
            Portfolio: '-',
            Key: <a href="https://jira.hcom/browse/PM-1001" rel="noopener noreferrer" target="_blank" >{'PM-1001'}</a>,
            id: defect.defectNumber,
            Summary: defect.summary,
            Priority: defect.priority,
            Status: defect.status,
            Resolution: defect.resolution,
            Opened: defect.openDate,
            'Days to Resolve': 2,
            'Time to Resolve': '3m'
        };
        expect(formatDefect(defect)).to.eql(formattedDefect);
    });

    it('formatDefect', () => {
        const id = 'PM-1002';
        const defect = {defectNumber: id, status: 'To Do'};
        const portfolio = 'kes';
        const tickets = {
            portfolioTickets: {
                [portfolio]: {
                    [id]: defect
                }
            }
        };
        const expectedDefect = formatDefect(defect);
        expectedDefect.Portfolio = portfolio;
        expect(findAndFormatTicket(tickets, id)).to.eql(expectedDefect);
    });

    it('mapPriority', () => {
        expect(mapPriority('1-High')).to.eql(P1_LABEL);
        expect(mapPriority('P2')).to.eql(P2_LABEL);
        expect(mapPriority('3')).to.eql(P3_LABEL);
        expect(mapPriority('4-low')).to.eql(P4_LABEL);
        expect(mapPriority('5')).to.eql(P5_LABEL);
        expect(mapPriority('6')).to.eql(NOT_PRIORITIZED_LABEL);
        expect(mapPriority()).to.eql(NOT_PRIORITIZED_LABEL);
        expect(mapPriority('-')).to.eql(NOT_PRIORITIZED_LABEL);
    });

    it('formatBarChartData', () => {
        const date = '2020-01-01';
        const counts = 7;
        const tickets = ['INC-0001', 'INC-0002', 'INC-0003', 'INC-0004', 'INC-0005', 'INC-0006', 'INC-0007'];
        const data = {
            [date]: {
                p1: 1,
                p2: 2,
                p3: 0,
                p4: 1,
                p5: 3,
                totalTickets: counts,
                ticketIds: tickets
            }
        };
        expect(formatBarChartData(data)).to.be.eql([{
            date,
            P1: 1,
            P2: 2,
            P3: 0,
            P4: 1,
            P5: 3,
            counts,
            tickets
        }]);
    });

    it('formatTTRData', () => {
        const date = '2020-01-01';
        const p1DaysToResolve = 1;
        const p1 = 1;
        const p2DaysToResolve = 2;
        const p2 = 2;
        const p4DaysToResolve = 4;
        const p4 = 2;
        const p5DaysToResolve = 3;
        const p5 = 2;
        const ticketIds = ['INC-0001'];
        const data = {
            [date]: {
                p1, p2, p4, p5,
                p1DaysToResolve,
                p2DaysToResolve,
                p4DaysToResolve,
                p5DaysToResolve,
                totalTickets: ticketIds.length, ticketIds
            }
        };
        expect(formatTTRData(data)).to.be.eql([{
            date,
            [P1_LABEL]: 1,
            [P2_LABEL]: 1,
            [P3_LABEL]: 0,
            [P4_LABEL]: 2,
            [P5_LABEL]: 2,
            counts: ticketIds.length,
            tickets: ticketIds
        }]);
    });

    it('formatPriorityCountsData', () => {
        const date = '2020-01-01';
        const p1 = 1;
        const p2 = 2;
        const p3 = 4;
        const p5 = 3;
        const notPrioritized = 3;
        const ticketIds = ['INC-0001'];
        const data = {[date]: {p1, p2, p3, p5, notPrioritized, totalTickets: ticketIds.length, ticketIds}};
        expect(formatPriorityCountsData(data)).to.be.eql([{
            date,
            [P1_LABEL]: p1,
            [P2_LABEL]: p2,
            [P3_LABEL]: p3,
            [P4_LABEL]: 0,
            [P5_LABEL]: p5,
            [NOT_PRIORITIZED_LABEL]: notPrioritized,
            counts: ticketIds.length,
            tickets: ticketIds
        }]);
    });

    it('formatDurationData', () => {
        const data = {
            kes: {
                avgP1MinsToResolve: 0,
                avgP2MinsToResolve: 1,
                avgP3MinsToResolve: 3,
                avgP4MinsToResolve: 5,
                avgP5MinsToResolve: 4,
                totalCount: 2,
                projectTTRSummaries: {
                    KES: {ticketIds: ['KES-2935', 'KES-2865']}
                }
            },
            checkout: {
                avgP1MinsToResolve: 1,
                avgP2MinsToResolve: 0,
                avgP3MinsToResolve: 1,
                avgP4MinsToResolve: 0,
                avgP5MinsToResolve: 0,
                totalCount: 2,
                projectTTRSummaries: {
                    EPOCH: {ticketIds: ['EPOCH-2833']},
                    HBILL: {ticketIds: ['HBILL-6593']}
                }
            }
        };
        const {kes, checkout} = formatDurationData(data);
        // kes
        expect(kes.p1).to.eql(data.kes.avgP1MinsToResolve);
        expect(kes.p2).to.eql(data.kes.avgP2MinsToResolve);
        expect(kes.p3).to.eql(data.kes.avgP3MinsToResolve);
        expect(kes.p4).to.eql(data.kes.avgP4MinsToResolve);
        expect(kes.p5).to.eql(data.kes.avgP5MinsToResolve);
        expect(kes.totalTickets).to.eql(data.kes.totalCount);
        expect(kes.ticketIds).to.eql(['KES-2935', 'KES-2865']);
        // checkout
        expect(checkout.p1).to.eql(data.checkout.avgP1MinsToResolve);
        expect(checkout.p2).to.eql(data.checkout.avgP2MinsToResolve);
        expect(checkout.p3).to.eql(data.checkout.avgP3MinsToResolve);
        expect(checkout.p4).to.eql(data.checkout.avgP4MinsToResolve);
        expect(checkout.p5).to.eql(data.checkout.avgP5MinsToResolve);
        expect(checkout.totalTickets).to.eql(data.checkout.totalCount);
        expect(checkout.ticketIds).to.eql(['EPOCH-2833', 'HBILL-6593']);
    });

    it('formatWoWData', () => {
        const date = '2020-01-01';
        const numberOfCreatedIssues = 1;
        const numberOfResolvedIssues = 2;
        const diffResolvedCreated = 1;
        const ticketIds = ['INC-0001'];
        const resolvedTicketIds = ['INC-0002'];
        const data = {
            [date]: {
                numberOfCreatedIssues,
                numberOfResolvedIssues,
                diffResolvedCreated,
                ticketIds,
                resolvedTicketIds
            }
        };
        expect(formatWoWData(data)).to.be.eql([{
            date,
            created: numberOfCreatedIssues,
            resolved: numberOfResolvedIssues,
            diff: diffResolvedCreated,
            'created tickets': ticketIds,
            'resolved tickets': resolvedTicketIds,
            'all tickets': [...ticketIds, ...resolvedTicketIds]
        }]);
    });

    it('groupDataByPillar', () => {
        const data = {
            'AND': {p4: 2, notPrioritized: 1, totalTickets: 3, ticketIds: ['AND-0001', 'AND-0002', 'AND-0003']},
            'ENG': {p1: 1, notPrioritized: 1, totalTickets: 2, ticketIds: ['ENG-0001', 'ENG-0002']},
            'KES': {p1: 1, p2: 1, p4: 1, p5: 2, totalTickets: 5, ticketIds: ['KES-0001', 'KES-0002', 'KES-0003', 'KES-0004', 'KES-0005']},
        };
        const result = groupDataByPillar(data);
        expect(result.Mobile).to.eql({
            p1: 1, p4: 2, notPrioritized: 2, totalTickets: 5, ticketIds: ['AND-0001', 'AND-0002', 'AND-0003', 'ENG-0001', 'ENG-0002']
        });
        expect(result.Kes).to.eql(data.KES);
    });

    it('formatTableData - counts by project', () => {
        const rowKey = 'rowKey';
        const result = formatTableData({
            'AND - Android': {p4: 2, notPrioritized: 1, totalTickets: 3, ticketIds: ['AND-0001', 'AND-0002', 'AND-0003']},
            'Kes': {p1: 1, p2: 1, p4: 1, p5: 2, totalTickets: 5, ticketIds: ['KES-0001', 'KES-0002', 'KES-0003', 'KES-0004', 'KES-0005']},
        }, () => true, rowKey);
        expect(result.length).to.eql(3);
        // AND
        const row0 = result[0];
        expect(row0[rowKey]).to.eql('AND - Android');
        expect(row0.p1).to.eql('-');
        expect(row0.p2).to.eql('-');
        expect(row0.p3).to.eql('-');
        expect(row0.p4.props.children).to.eql(2);
        expect(row0.p5).to.eql('-');
        expect(row0.notPrioritized.props.children).to.eql(1);
        expect(row0.totalTickets.props.children).to.eql(3);
        // KES
        const row1 = result[1];
        expect(row1[rowKey]).to.eql('Kes');
        expect(row1.p1.props.children).to.eql(1);
        expect(row1.p2.props.children).to.eql(1);
        expect(row1.p3).to.eql('-');
        expect(row1.p4.props.children).to.eql(1);
        expect(row1.p5.props.children).to.eql(2);
        expect(row1.notPrioritized).to.eql('-');
        expect(row1.totalTickets.props.children).to.eql(5);
        // Summary Row
        const row2 = result[2];
        expect(row2[rowKey]).to.eql('Total Unique Issues');
        expect(row2.p1.props.children).to.eql(1);
        expect(row2.p2.props.children).to.eql(1);
        expect(row2.p3.props.children).to.eql(0);
        expect(row2.p4.props.children).to.eql(3);
        expect(row2.p5.props.children).to.eql(2);
        expect(row2.notPrioritized.props.children).to.eql(1);
        expect(row2.totalTickets.props.children).to.eql(8);
    });

    it('formatTableData - duration by project', () => {
        const rowKey = 'rowKey';
        const result = formatTableData({
            'AND - Android': {p4: 2, notPrioritized: 1, totalTickets: 3, ticketIds: ['AND-0001', 'AND-0002', 'AND-0003']},
            'Kes': {p1: 1, p2: 1, p4: 1, p5: 2, totalTickets: 5, ticketIds: ['KES-0001', 'KES-0002', 'KES-0003', 'KES-0004', 'KES-0005']},
        }, () => true, rowKey, true);
        expect(result.length).to.eql(2);
        // AND
        const row0 = result[0];
        expect(row0[rowKey]).to.eql('AND - Android');
        expect(row0.p1).to.eql('-');
        expect(row0.p2).to.eql('-');
        expect(row0.p3).to.eql('-');
        expect(row0.p4.props.children).to.eql('2m');
        expect(row0.p5).to.eql('-');
        expect(row0.notPrioritized.props.children).to.eql('1m');
        expect(row0.totalTickets.props.children).to.eql(3);
        // KES
        const row1 = result[1];
        expect(row1[rowKey]).to.eql('Kes');
        expect(row1.p1.props.children).to.eql('1m');
        expect(row1.p2.props.children).to.eql('1m');
        expect(row1.p3).to.eql('-');
        expect(row1.p4.props.children).to.eql('1m');
        expect(row1.p5.props.children).to.eql('2m');
        expect(row1.notPrioritized).to.eql('-');
        expect(row1.totalTickets.props.children).to.eql(5);
    });

    it('processTwoDimensionalIssues', () => {
        const defects = [
            {defectNumber: 'AND-1001', priority: '1-High', status: 'To Do'},
            {defectNumber: 'AND-1002', priority: '3-Medium', status: 'To Do'},
            {defectNumber: 'AND-1003', priority: '3-Medium', status: 'To Do'},
            {defectNumber: 'AND-1004', priority: '5-Trivial', status: 'To Do'},
            {defectNumber: 'AND-1005', priority: '5-Trivial', status: 'To Do'},
            {defectNumber: 'AND-1006', priority: '5-Trivial', status: 'To Do'},
        ];
        const project = 'openBugs';
        const projectTickets = {
            [project]: {
                p1: 1, p2: 0, p3: 2, p4: 0, p5: 0, totalTickets: 6, ticketIds: defects.map((d) => d.defectNumber)
            }
        };
        const allJiraTickets = {
            portfolioTickets: {
                mobile: defects.reduce((acc, curr) => {
                    acc[curr.defectNumber] = curr;
                    return acc;
                }, {})
            }
        };
        expect(processTwoDimensionalIssues(allJiraTickets, projectTickets, project))
            .to.eql({data: defects.map(formatDefect), description: 'Displaying all "openBugs" defects'});
        expect(processTwoDimensionalIssues(allJiraTickets, projectTickets, project, P1_LABEL))
            .to.eql({data: [defects[0]].map(formatDefect), description: 'Displaying "openBugs" defects with P1 priority'});
        expect(processTwoDimensionalIssues(allJiraTickets, projectTickets, project, P2_LABEL))
            .to.eql({data: [], description: 'Displaying "openBugs" defects with P2 priority'});
        expect(processTwoDimensionalIssues(allJiraTickets, projectTickets, project, P3_LABEL))
            .to.eql({data: [defects[1], defects[2]].map(formatDefect), description: 'Displaying "openBugs" defects with P3 priority'});
        expect(processTwoDimensionalIssues(allJiraTickets, projectTickets, project, P4_LABEL))
            .to.eql({data: [], description: 'Displaying "openBugs" defects with P4 priority'});
        expect(processTwoDimensionalIssues(allJiraTickets, projectTickets, project, P5_LABEL))
            .to.eql({data: [defects[3], defects[4], defects[5]].map(formatDefect), description: 'Displaying "openBugs" defects with P5 priority'});
    });

    it('formatCreatedVsResolvedData', () => {
        const weekStartDate = '2020-02-16';
        const data = {
            createdIssuesByWeek: {
                [weekStartDate]: {p1: 1, p4: 1, weekStartDate, totalTickets: 2, weekEndDate: '2020-02-22', ticketIds: ['AND-17049', 'AND-17048']}
            },
            resolvedIssuesByWeek: {
                [weekStartDate]: {p1: 1, p2: 1, notPrioritized: 2, weekStartDate, totalTickets: 4, weekEndDate: '2020-02-22', ticketIds: ['AND-17041', 'AND-17042']}
            }
        };
        // Include all priorities but P4 to check for exclusion logic
        const priorities = [P1_LABEL, P2_LABEL, P3_LABEL, P5_LABEL, 'notPrioritized'];
        expect(formatCreatedVsResolvedData(data, priorities)).to.be.eql([{
            date: weekStartDate,
            'Total Created': 1,
            'Total Resolved': 4,
            createdTickets: ['AND-17049', 'AND-17048'],
            resolvedTickets: ['AND-17041', 'AND-17042']
        }]);
    });

    it('getPanelDataUrl', () => {
        const projectKeys = ['LASER', 'ENG'];
        const start = moment().subtract(400, 'days');
        const end = moment();
        const brand = HOTELS_COM_BRAND;
        const panel = 'opendefects';
        expect(getPanelDataUrl(start, end, projectKeys, brand, panel)).to.be.equal(
            `/v1/portfolio/panel/${panel}?fromDate=${start.format(DATE_FORMAT)}&toDate=${end.format(DATE_FORMAT)}&projectKeys=LASER&projectKeys=ENG`
        );
        const ttrPanel = 'ttrSummary';
        expect(getPanelDataUrl(start, end, projectKeys, brand, ttrPanel)).to.be.equal(
            `/v1/portfolio/${ttrPanel}?fromDate=${start.format(DATE_FORMAT)}&toDate=${end.format(DATE_FORMAT)}&projectKeys=LASER&projectKeys=ENG`
        );
        expect(getPanelDataUrl(start, end, projectKeys, brand)).to.be.equal(
            `/v1/portfolio?fromDate=${start.format(DATE_FORMAT)}&toDate=${end.format(DATE_FORMAT)}&projectKeys=LASER&projectKeys=ENG`
        );
    });
});
