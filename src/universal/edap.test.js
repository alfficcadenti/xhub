/* eslint-disable no-unused-expressions */
import {expect} from 'chai';
import {
    triggerEdapPageView,
    triggerEdapDateRangeApplied
} from './edap';
import analyticsDataLayer from '../server/utils/analyticsDataLayer';

describe('formatDuration', () => {
    it('returns undefined', () => {
        expect(triggerEdapPageView('success-rate')).to.be.undefined;
    });

    it('returns adl', () => {
        window.analyticsdatalayer = analyticsDataLayer({name: 'vrbo'});
        window.edap.trigger = () => {};
        expect(triggerEdapPageView('success-rate')).to.be.undefined;
    });

    it('returns triggerEdapDateRangeApplied undefined', () => {
        expect(triggerEdapDateRangeApplied()).to.be.undefined;
    });
});
