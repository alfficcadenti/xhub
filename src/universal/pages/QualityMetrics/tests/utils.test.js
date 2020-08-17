import {expect} from 'chai';
import {
    getPropValue, formatTickets, formatBarChartData
} from '../utils';


describe('Quality Metrics Util', () => {
    it('getPropValue', () => {
        const item = {a: 'hello'};
        expect(getPropValue(item, 'a')).to.be.eql('hello');
        expect(getPropValue(item, 'b')).to.be.eql('-');
    });

    it('formatTickets', () => {
        const portfolioName = 'portfolioName';
        const ticket = {
            defectNumber: 'INC-0001',
            summary: 'Summary',
            priority: '1-High',
            status: 'Done',
            resolution: null,
            openDate: '2020-01-01'
        };
        const tickets = {
            portfolioTickets: {
                [portfolioName]: {[ticket.jiraTicketId]: ticket}
            }
        };
        expect(formatTickets(tickets)).to.be.eql([{
            Portfolio: portfolioName,
            Key: ticket.defectNumber,
            Summary: ticket.summary,
            Priority: ticket.priority,
            Status: ticket.status,
            Resolution: '-',
            Opened: ticket.openDate
        }]);
        expect(formatTickets({})).to.be.eql([]);
    });

    it('formatBarChartData', () => {
        const date = '2020-01-01';
        const counts = 1;
        const tickets = ['INC-0001'];
        const data = {[date]: {totalTickets: counts, ticketIds: tickets}};
        expect(formatBarChartData(data)).to.be.eql([{date, counts, tickets}]);
    });
});
