import {expect} from 'chai';
import moment from 'moment';
import {
    getQueryValues,
    labelFormat,
    formatPieData,
    formatLeadTimeData,
    mapAgileInsight,
    formatLineChartData,
    formatTooltipData,
    listOfBugs
} from '../utils';

describe('AgileScorecard - Utils', () => {
    it('getQueryValues - default', () => {
        const start = moment().subtract(6, 'months').startOf('minute').format('YYYY-MM-DD');
        const end = moment().format('YYYY-MM-DD');
        const {initialStart, initialEnd, initialTeams} = getQueryValues('');
        expect(initialStart).to.be.eql(start);
        expect(initialEnd).to.be.eql(end);
        expect(initialTeams).to.be.eql('');
    });

    it('getQueryValues - custom', () => {
        const start = '2020-01-01';
        const end = '2020-02-02';
        const teams = 'teamA,teamB';
        const {initialStart, initialEnd, initialTeams} = getQueryValues(`?start=${start}&end=${end}&teams=${teams}`);
        expect(initialStart).to.be.eql(start);
        expect(initialEnd).to.be.eql(end);
        expect(initialTeams).to.be.eql(teams);
    });

    it('labelFormat', () => {
        expect(labelFormat({count: 0, total: 0, label: 'LABEL_A'})).to.be.eql('Select LABEL_A...');
        expect(labelFormat({count: 2, total: 3, label: 'LABEL_B'})).to.be.eql('LABEL_B  (2 of 3 selected)');
    });

    it('formatPieData', () => {
        const typeOfWork = 'TYPE OF WORK';
        const ticketCount = 22;
        expect(formatPieData(null)).to.be.eql([]);
        expect(formatPieData([{type_of_work: typeOfWork, ticket_count: ticketCount}])).to.be.eql([{name: typeOfWork, value: ticketCount}]);
    });

    it('formatLeadTimeData', () => {
        const openDate = '2022-01-01';
        const leadTime = 10000;
        expect(formatLeadTimeData(null)).to.be.eql(false);
        expect(formatLeadTimeData([{openDate, leadTime}])).to.be.eql([{name: 'Jan-01', openDate, 'Mean Lead Time': Math.round(leadTime / 60)}]);
    });

    it('mapAgileInsight', () => {
        const a = {
            id: 'SOME-1001',
            project: 'project',
            severity: 'severity',
            brand: 'brand',
            summary: 'summary',
            projectKey: 'projectKey',
            openDate: '2022-01-01',
            priority: 'priority',
            resolvedDate: '2022-01-04',
            tag: null,
            resolution: 'solved',
            impactedBrand: 'impactedBrand',
            labels: 'insights-team-hello,insights-team-there,ignore',
            updatedDateTime: '2022-01-05',
            issueType: 'bug',
            lastClosed: '2022-01-05',
            leadTime: 999999
        };
        const result = mapAgileInsight(a);
        expect(result.Project).to.be.eql(a.project);
        expect(result.Severity).to.be.eql(a.severity);
        expect(result.Brand).to.be.eql(a.brand);
        expect(result.Summary).to.be.eql(a.summary);
        expect(result['Project Key']).to.be.eql(a.projectKey);
        expect(result['Open Date']).to.be.eql(a.openDate);
        expect(result.Priority).to.be.eql(a.priority);
        expect(result.Resolved).to.be.eql(a.resolvedDate);
        expect(result.Tag).to.be.eql('-');
        expect(result.Resolution).to.be.eql(a.resolution);
        expect(result['Impacted Brand']).to.be.eql(a.impactedBrand);
        expect(result.Labels).to.be.eql(a.labels);
        expect(result.Teams).to.be.eql('hello,there');
        expect(result.Updated).to.be.eql(a.updatedDateTime);
        expect(result['Issue Type']).to.be.eql(a.issueType);
        expect(result['Last Closed']).to.be.eql(a.lastClosed);
        expect(String(result['Lead Time']).includes('694d 10h 39m')).to.be.eql(true);
    });

    it('formatLineChartData', () => {
        const date = '2022-01-01';
        const openCount = 22;
        expect(formatLineChartData(null)).to.be.eql([]);
        expect(formatLineChartData([{date, open_bugs_count: openCount, closed_bugs_count: null}]))
            .to.be.eql([{name: 'Jan-01', date, 'open bugs': openCount, 'closed bugs': 0}]);
    });

    it('formatTooltipData', () => {
        const count = 22;
        const ticketsA = ['TICKET-6001', 'TICKET-4001'];
        const ticketsB = ['TICKET-1001', 'TICKET-2001'];
        expect(formatTooltipData(null)).to.be.eql({});
        expect(formatTooltipData([{date: '2022-01-01', open_bugs_count: count, open_bugs_ticket_ids: ticketsA, closed_bugs_ticket_ids: ticketsB}]))
            .to.be.eql({'2022-01-01': {'open bugs': ticketsA.sort(), 'closed bugs': ticketsB}});
    });

    it('listOfBugs', () => {
        expect(listOfBugs(null, null)).to.be.eql([]);
        expect(listOfBugs({type: [22]}, 'type')).to.be.eql([22]);
    });
});
