import React from 'react';
import {expect} from 'chai';
import {
    getPropValue,
    formatDefect,
    findAndFormatTicket,
    mapPriority,
    formatBarChartData,
    formatTTRData,
    formatWoWData,
    formatCreatedVsResolvedData,
    getPanelDataUrl
} from '../utils';
import {P1_LABEL, P2_LABEL, P3_LABEL, P4_LABEL} from '../constants';

describe('Quality Metrics Util', () => {
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
            openDate: '2020-01-02'
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
        expect(mapPriority('P1')).to.eql(P1_LABEL);
        expect(mapPriority('P2')).to.eql(P2_LABEL);
        expect(mapPriority('P3')).to.eql(P3_LABEL);
        expect(mapPriority('P4')).to.eql(P4_LABEL);
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
        const brand = 'HCOM';
        const panel = 'opendefects';
        expect(getPanelDataUrl(portfolios, brand, panel)).to.be.equal(`/v1/portfolio/panel/${panel}?brand=${brand}&portfolios=kes`);
        expect(getPanelDataUrl(portfolios, brand)).to.be.equal(`/v1/portfolio?brand=${brand}&portfolios=kes`);
    });
});
