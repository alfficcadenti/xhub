import React from 'react';
import moment from 'moment';
import {expect} from 'chai';
import {
    getPortfolioBrand,
    getQueryValues,
    getPropValue,
    formatDefect,
    findAndFormatTicket,
    mapPriority,
    formatBarChartData,
    formatTTRData,
    formatWoWData,
    groupDataByPillar,
    formatTableData,
    formatCreatedVsResolvedData,
    processTwoDimensionalIssues,
    getPanelDataUrl
} from '../utils';
import {PORTFOLIOS, P1_LABEL, P2_LABEL, P3_LABEL, P4_LABEL, P5_LABEL, NOT_PRIORITIZED_LABEL} from '../constants';
import {HOTELS_COM_BRAND, EXPEDIA_BRAND, DATE_FORMAT} from '../../../constants';

describe('Quality Metrics Util', () => {
    it('getPortfolioBrand', () => {
        expect(getPortfolioBrand([HOTELS_COM_BRAND])).to.be.eql('HCOM');
        expect(getPortfolioBrand([EXPEDIA_BRAND])).to.be.eql('BEX');
    });

    it('getQueryValues', () => {
        const portfolios = ['kes'];
        expect(getQueryValues(`https://localhost:8080/quality-metrics?selectedBrand=${HOTELS_COM_BRAND}&portfolios=${portfolios.toString()}`)).to.be.eql({
            initialPortfolios: portfolios.map((p) => PORTFOLIOS.find(({value}) => p === value))
        });
    });

    it('getPropValue', () => {
        const item = {a: 'hello'};
        expect(getPropValue(item, 'a')).to.be.eql('hello');
        expect(getPropValue(item, 'b')).to.be.eql('-');
    });

    it('formatDefect', () => {
        const defect = {
            defectNumber: 'PM-1001',
            summary: 'summary',
            priority: 'priority',
            status: 'Done',
            resolution: 'resolution',
            openDate: '2020-01-02',
            url: 'https://jira.hcom/browse/PM-1001'
        };
        const formattedDefect = {
            Portfolio: '-',
            Key: <a href="https://jira.hcom/browse/PM-1001" target="_blank">{'PM-1001'}</a>,
            id: defect.defectNumber,
            Summary: defect.summary,
            Priority: defect.priority,
            Status: defect.status,
            Resolution: defect.resolution,
            Opened: defect.openDate,
            'Days to Resolve': '-'
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
        expect(mapPriority('0-Code Red')).to.eql(P1_LABEL);
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
        const p2DaysToResolve = 2;
        const p4DaysToResolve = 4;
        const p5DaysToResolve = 3;
        const ticketIds = ['INC-0001'];
        const data = {
            [date]: {
                p1DaysToResolve,
                p2DaysToResolve,
                p4DaysToResolve,
                p5DaysToResolve,
                totalTickets: ticketIds.length, ticketIds
            }
        };
        expect(formatTTRData(data)).to.be.eql([{
            date,
            [P1_LABEL]: p1DaysToResolve,
            [P2_LABEL]: p2DaysToResolve,
            [P3_LABEL]: 0,
            [P4_LABEL]: p4DaysToResolve,
            [P4_LABEL]: p4DaysToResolve,
            [P5_LABEL]: p5DaysToResolve,
            counts: ticketIds.length,
            tickets: ticketIds
        }]);
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
            'AND - Android': {p4: 2, notPrioritized: 1, totalTickets: 3, ticketIds: ['AND-0001', 'AND-0002', 'AND-0003']},
            'iOS Engagement': {p1: 1, notPrioritized: 1, totalTickets: 2, ticketIds: ['ENG-0001', 'ENG-0002']},
            'Kes': {p1: 1, p2: 1, p4: 1, p5: 2, totalTickets: 5, ticketIds: ['KES-0001', 'KES-0002', 'KES-0003', 'KES-0004', 'KES-0005']},
        };
        const result = groupDataByPillar(data, [{text: 'Mobile'}, {text: 'Kes'}]);
        expect(result.Mobile).to.eql({
            p1: 1, p4: 2, notPrioritized: 2, totalTickets: 5, ticketIds: ['AND-0001', 'AND-0002', 'AND-0003', 'ENG-0001', 'ENG-0002']
        });
        expect(result.Kes).to.eql(data.Kes);
    });

    it('formatTableData by Project', () => {
        const rowKey = 'rowKey';
        const result = formatTableData({
            'AND - Android': {p4: 2, notPrioritized: 1, totalTickets: 3, ticketIds: ['AND-0001', 'AND-0002', 'AND-0003']},
            'Kes': {p1: 1, p2: 1, p4: 1, p5: 2, totalTickets: 5, ticketIds: ['KES-0001', 'KES-0002', 'KES-0003', 'KES-0004', 'KES-0005']},
        }, () => true, rowKey);
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

    it('processTwoDimensionalIssues', () => {
        const defects = [
            {defectNumber: 'AND-1001', priority: '1-High', status: 'To Do'},
            {defectNumber: 'AND-1002', priority: '3-Medium', status: 'To Do'},
            {defectNumber: 'AND-1003', priority: '3-Medium', status: 'To Do'},
            {defectNumber: 'AND-1004', priority: '5-Trivial', status: 'To Do'},
            {defectNumber: 'AND-1005', priority: '5-Trivial', status: 'To Do'},
            {defectNumber: 'AND-1006', priority: '5-Trivial', status: 'To Do'},
        ];
        const portfolios = [{text: 'AND - Android', value: 'and'}];
        const project = 'openBugs';
        const projectTickets = {
            [project]: {
                p1: 1, p2: 0, p3: 2, p4: 0, p5: 0, totalTickets: 6, ticketIds: defects.map((d) => d.defectNumber)
            }
        };
        const allJiraTickets = {
            portfolioTickets: {
                and: defects.reduce((acc, curr) => {
                    acc[curr.defectNumber] = curr;
                    return acc;
                }, {})
            }
        };
        expect(processTwoDimensionalIssues(allJiraTickets, projectTickets, project, portfolios))
            .to.eql({data: defects.map(formatDefect), description: 'Displaying all "openBugs" defects'});
        expect(processTwoDimensionalIssues(allJiraTickets, projectTickets, project, portfolios, P1_LABEL))
            .to.eql({data: [defects[0]].map(formatDefect), description: 'Displaying "openBugs" defects with P1 priority'});
        expect(processTwoDimensionalIssues(allJiraTickets, projectTickets, project, portfolios, P2_LABEL))
            .to.eql({data: [], description: 'Displaying "openBugs" defects with P2 priority'});
        expect(processTwoDimensionalIssues(allJiraTickets, projectTickets, project, portfolios, P3_LABEL))
            .to.eql({data: [defects[1], defects[2]].map(formatDefect), description: 'Displaying "openBugs" defects with P3 priority'});
        expect(processTwoDimensionalIssues(allJiraTickets, projectTickets, project, portfolios, P4_LABEL))
            .to.eql({data: [], description: 'Displaying "openBugs" defects with P4 priority'});
        expect(processTwoDimensionalIssues(allJiraTickets, projectTickets, project, portfolios, P5_LABEL))
            .to.eql({data: [defects[3], defects[4], defects[5]].map(formatDefect), description: 'Displaying "openBugs" defects with P5 priority'});
    });

    it('formatCreatedVsResolvedData', () => {
        const weekStartDate = '2020-02-16';
        const data = {
            createdIssuesByWeek: {
                [weekStartDate]: {p1: 1, p4: 1, weekStartDate, totalTickets: 2, weekEndDate: '2020-02-22', ticketIds: ['AND-17049', 'AND-17048']}
            },
            resolvedIssuesByWeek: {
                [weekStartDate]: {p1: 1, p2: 1, weekStartDate, totalTickets: 2, weekEndDate: '2020-02-22', ticketIds: ['AND-17041', 'AND-17042']}
            }
        };
        expect(formatCreatedVsResolvedData(data)).to.be.eql([{
            date: weekStartDate,
            'Created Not Prioritized': 0,
            'Created P1': 1,
            'Created P2': 0,
            'Created P3': 0,
            'Created P4': 1,
            'Created P5': 0,
            'Resolved Not Prioritized': 0,
            'Resolved P1': 1,
            'Resolved P2': 1,
            'Resolved P3': 0,
            'Resolved P4': 0,
            'Resolved P5': 0,
            'Total Created': 2,
            'Total Resolved': 2,
            createdTickets: ['AND-17049', 'AND-17048'],
            resolvedTickets: ['AND-17041', 'AND-17042']
        }]);
    });

    it('getPanelDataUrl', () => {
        const portfolios = [{text: 'KES', value: 'kes'}];
        const start = moment().subtract(180, 'days').format(DATE_FORMAT);
        const end = moment().format(DATE_FORMAT);
        const brand = 'HCOM';
        const panel = 'opendefects';
        expect(getPanelDataUrl(portfolios, brand, panel)).to.be.equal(
            `/v1/portfolio/panel/${panel}?brand=${brand}&fromDate=${start}&toDate=${end}&portfolios=kes`
        );
        expect(getPanelDataUrl(portfolios, brand)).to.be.equal(
            `/v1/portfolio?brand=${brand}&fromDate=${start}&toDate=${end}&portfolios=kes`
        );
    });
});
