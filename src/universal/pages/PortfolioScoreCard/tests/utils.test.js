import moment from 'moment';
import {expect} from 'chai';
import {
    formatPercentage,
    getQueryValues,
    mapOrgDetails,
    mapTicketDetails
} from '../utils';


describe('Portfolio ScoreCard utils', () => {
    it('formatPercentage', () => {
        expect(formatPercentage(null)).to.eql('-');
        expect(formatPercentage(0)).to.eql('0%');
        expect(formatPercentage(75)).to.eql('75%');
    });

    it('getQueryValues - default', () => {
        const start = moment().subtract(1, 'years').startOf('minute').format('YYYY-MM-DD');
        const end = moment().format('YYYY-MM-DD');
        const l1 = 'businessA';
        const result = getQueryValues(`?l1=${l1}`);
        expect(result.initialStart).to.be.eql(start);
        expect(result.initialEnd).to.be.eql(end);
    });

    it('getQueryValues - custom', () => {
        const start = '2020-01-01';
        const end = '2020-02-02';

        const result = getQueryValues(`?start=${start}&end=${end}`);
        expect(result.initialStart).to.be.eql(start);
        expect(result.initialEnd).to.be.eql(end);
    });

    it('mapOrgDetails', () => {
        const row = {
            name: 'Test Name',
            p1IncidentCount: 25,
            p2IncidentCount: 18,
            percentIncidentsTtdWithin15MinSlo: 24,
            percentIncidentsTtfWithin15MinSlo: 90,
            percentIncidentsTtkWithin30MinSlo: 93,
            percentIncidentsTtrWithin60MinSlo: 87
        };
        const handleSelectOrg = jest.fn();
        const handleSelectTickets = jest.fn();
        const result = mapOrgDetails(row, handleSelectOrg, handleSelectTickets);
        expect(result['TTD<=15m']).to.be.eql('24%');
        expect(result['TTF<=15m']).to.be.eql('90%');
        expect(result['TTK<=30m']).to.be.eql('93%');
        expect(result['TTR<=60m']).to.be.eql('87%');
    });

    it('mapTicketDetails', () => {
        const row = {
            number: 'INC-1000',
            priority: 'P1',
            title: null,
            timeToDetect: 10,
            timeToKnow: 15,
            timeToFix: 64,
            timeToRestore: 65
        };
        const [result] = mapTicketDetails([row]);

        expect(result.Priority).to.be.eql(row.priority);
        expect(result.Title).to.be.eql('-');
        expect(result['Time To Detect']).to.be.eql(row.timeToDetect);
        expect(result['Time To Know']).to.be.eql(row.timeToKnow);
        expect(result['Time To Fix']).to.be.eql(row.timeToFix);
        expect(result['Time To Restore']).to.be.eql(row.timeToRestore);
    });
});
