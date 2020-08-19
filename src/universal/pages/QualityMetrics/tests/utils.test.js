import {expect} from 'chai';
import {
    getPropValue,
    formatDefect,
    findAndFormatTicket,
    mapPriority,
    formatBarChartData,
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
            Key: defect.defectNumber,
            Summary: defect.summary,
            Priority: defect.priority,
            Status: defect.status,
            Resolution: defect.resolution,
            Opened: defect.openDate
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
        const data = {[date]: {totalTickets: counts, ticketIds: tickets}};
        expect(formatBarChartData(data)).to.be.eql([{date, P1: 0, P2: 0, P3: 0, P4: 0, counts, tickets}]);
    });

    it('getPanelDataUrl', () => {
        const portfolios = [{text: 'KES', value: 'kes'}];
        const brand = 'HCOM';
        const panel = 'opendefects';
        expect(getPanelDataUrl(portfolios, brand, panel)).to.be.equal(`/v1/portfolio/panel/${panel}?brand=${brand}&portfolios=kes`);
        expect(getPanelDataUrl(portfolios, brand)).to.be.equal(`/v1/portfolio?brand=${brand}&portfolios=kes`);
    });
});
