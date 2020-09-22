import React from 'react';
import {expect} from 'chai';
import {
    getPortfolioBrand,
    getQueryValues,
    getPropValue,
    formatDefect,
    findAndFormatTicket,
    mapPriority,
    getTicketIds,
    formatBarChartData,
    formatTTRData,
    formatWoWData,
    formatCreatedVsResolvedData,
    processTwoDimensionalIssues,
    getPanelDataUrl
} from '../utils';
import {PORTFOLIOS, P1_LABEL, P2_LABEL, P3_LABEL, P4_LABEL, P5_LABEL, NOT_PRIORITIZED_LABEL} from '../constants';
import {HOTELS_COM_BRAND, EXPEDIA_BRAND} from '../../../constants';

describe('Quality Metrics Util', () => {
    it('getPortfolioBrand', () => {
        expect(getPortfolioBrand([HOTELS_COM_BRAND])).to.be.eql('HCOM');
        expect(getPortfolioBrand([EXPEDIA_BRAND])).to.be.eql('BEX');
    });

    it('getQueryValues', () => {
        const portfolios = ['kes'];
        const start = '2020-01-01';
        const end = '2020-02-02';
        expect(getQueryValues(`https://localhost:8080/quality-metrics?selectedBrand=${HOTELS_COM_BRAND}&portfolios=${portfolios.toString()}&start=${start}&end=${end}`)).to.be.eql({
            initialPortfolios: portfolios.map((p) => PORTFOLIOS.find(({value}) => p === value)), initialStart: start, initialEnd: end
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

    it('getTicketIds', () => {
        expect(getTicketIds({
            '2020-03-22': {p4: 2, weekStartDate: '2020-03-22', weekEndDate: '2020-03-28', ticketIds: ['KES-2391', 'AND-17284']},
            '2020-04-05': {p3: 1, weekStartDate: '2020-04-05', weekEndDate: '2020-05-11', ticketIds: ['KES-2494']}
        })).to.eql(['KES-2391', 'AND-17284', 'KES-2494']);
    });

    it('formatBarChartData', () => {
        const date = '2020-01-01';
        const counts = 1;
        const tickets = ['INC-0001'];
        const data = {
            [date]: {
                totalTickets: counts,
                ticketIds: tickets
            }
        };
        expect(formatBarChartData(data)).to.be.eql([{
            date,
            P1: 0,
            P2: 0,
            P3: 0,
            P4: 0,
            counts,
            tickets
        }]);
    });

    it('formatTTRData', () => {
        const date = '2020-01-01';
        const p1DaysToResolve = 1;
        const p2DaysToResolve = 2;
        const p4DaysToResolve = 4;
        const ticketIds = ['INC-0001'];
        const data = {
            [date]: {
                p1DaysToResolve,
                p2DaysToResolve,
                p4DaysToResolve,
                totalTickets: ticketIds.length, ticketIds
            }
        };
        expect(formatTTRData(data)).to.be.eql([{
            date,
            [P1_LABEL]: p1DaysToResolve,
            [P2_LABEL]: p2DaysToResolve,
            [P3_LABEL]: 0,
            [P4_LABEL]: p4DaysToResolve,
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
            created: 2,
            resolved: 2,
            createdTickets: ['AND-17049', 'AND-17048'],
            resolvedTickets: ['AND-17041', 'AND-17042']
        }]);
        expect(formatCreatedVsResolvedData(data, ['P1'])).to.be.eql([{
            date: weekStartDate,
            created: 1,
            resolved: 1,
            createdTickets: ['AND-17049', 'AND-17048'],
            resolvedTickets: ['AND-17041', 'AND-17042']
        }]);
    });

    it('getPanelDataUrl', () => {
        const portfolios = [{text: 'KES', value: 'kes'}];
        const start = '2020-01-01';
        const end = '2020-02-02';
        const brand = 'HCOM';
        const panel = 'opendefects';
        expect(getPanelDataUrl(portfolios, start, end, brand, panel)).to.be.equal(
            `/v1/portfolio/panel/${panel}?brand=${brand}&fromDate=${start}&toDate=${end}&portfolios=kes`
        );
        expect(getPanelDataUrl(portfolios, start, end, brand)).to.be.equal(
            `/v1/portfolio?brand=${brand}&fromDate=${start}&toDate=${end}&portfolios=kes`
        );
    });
});
