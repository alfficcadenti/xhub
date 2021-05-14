import moment from 'moment';
import {expect} from 'chai';
import {
    getQueryValues,
    mapDetails,
    detectThreshold
} from '../utils';


describe('Portfolio ScoreCard utils', () => {
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

    it('detectThreshold - over threshold', () => {
        const result = detectThreshold(25);
        expect(result).to.be.eql('');
    });

    it('detectThreshold - under threshold', () => {
        const result = detectThreshold(75);
        expect(result).to.be.eql('under-threshold');
    });

    it('mapDetails()', () => {
        const rowValue = {
            name: 'Test Name',
            p1IncidentCount: 25,
            p2IncidentCount: 18,
            percentIncidentsTtdWithin15MinSlo: 24,
            percentIncidentsTtfWithin15MinSlo: 90,
            percentIncidentsTtkWithin30MinSlo: 93,
            percentIncidentsTtrWithin60MinSlo: 87
        };

        const result = mapDetails(rowValue);
        expect(result.P1).to.be.eql(25);
        expect(result.P2).to.be.eql(18);
        expect(result['TTD<=15M']).to.be.eql(24);
        expect(result['TTF<=15M']).to.be.eql(90);
        expect(result['TTK<=30M']).to.be.eql(93);
        expect(result['TTR<=30M']).to.be.eql(87);
    });

    it('mapDetails - default values', () => {
        const rowValue = {
            name: '',
            p1IncidentCount: 0,
            p2IncidentCount: 0,
            percentIncidentsTtdWithin15MinSlo: 0,
            percentIncidentsTtfWithin15MinSlo: 0,
            percentIncidentsTtkWithin30MinSlo: 0,
            percentIncidentsTtrWithin60MinSlo: 0
        };

        const result = mapDetails(rowValue);
        expect(result.P1).to.be.eql('-');
        expect(result.P2).to.be.eql('-');
        expect(result['TTD<=15M']).to.be.eql('-');
        expect(result['TTF<=15M']).to.be.eql('-');
        expect(result['TTK<=30M']).to.be.eql('-');
        expect(result['TTR<=30M']).to.be.eql('-');
    });
});
