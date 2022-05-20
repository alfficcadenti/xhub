import moment from 'moment';
import {expect} from 'chai';
import {ALL_PRIORITIES_OPTION, ALL_STATUSES_OPTION} from '../../../../constants';
import {
    convertDateToISOString,
    getQueryValues
} from '../utils';

describe('Fci Utils', () => {
    it('convertDateToISOString', () => {
        const browserTimezone = moment.tz.guess();
        const date = '2021-10-12 22:13';
        const ISOString = moment(date, 'YYYY-MM-DD hh:mm').tz(browserTimezone).toISOString();
        expect(convertDateToISOString(date)).to.be.eql(ISOString);
    });

    it('getQueryValues - default', () => {
        const result = getQueryValues();
        const ISOStringFormat = 'YYYY-MM-DDTHH:mm:ss.sssZ';
        expect(moment(result.initialStart, ISOStringFormat).diff(moment().subtract(14, 'days'), 'minutes')).to.be.lessThan(2);
        expect(moment(result.initialEnd, ISOStringFormat).diff(moment(), 'minutes')).to.be.lessThan(2);
        expect(result.initialStatus).to.be.eql(ALL_STATUSES_OPTION);
        expect(result.initialPriority).to.be.eql(ALL_PRIORITIES_OPTION);
    });

    it('getQueryValues - custom', () => {
        const start = '2021-01-01T05:00:00.000Z';
        const end = '2021-02-02T06:00:00.000Z';
        const status = 'Done';
        const priority = '1-Critical';
        const result = getQueryValues(`?from=${start}`
            + `&to=${end}`
            + `&status=${status}`
            + `&priority=${priority}`);
        expect(result.initialStart).to.be.eql(convertDateToISOString(start));
        expect(result.initialEnd).to.be.eql(convertDateToISOString(end));
        expect(result.initialStatus).to.be.eql(status);
        expect(result.initialPriority).to.be.eql(priority);
    });
});
