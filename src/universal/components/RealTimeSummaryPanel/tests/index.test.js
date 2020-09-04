import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';
import RealTimeSummaryPanel from '../';

const realTimeTotals = {
    'Checkout (CKO) To Checkout Confirmation Page': 0,
    'Home To Search Page (SERP)': 36.83618495056539,
    'Property (PDP) To Checkout Page (CKO)': 50.3001200480192,
    'Search (SERP) To Property Page (PDP)': 59.23
};

describe('RealTimeSummaryPanel component testing', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<RealTimeSummaryPanel realTimeTotals={realTimeTotals} isRttLoading={false} />);
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('renders successfully', () => {
        expect(wrapper).to.have.length(1);
    });

    it('renders correct container when there is no errors', () => {
        wrapper.setProps({isRttLoading: false});
        expect(wrapper.render().find('.real-time-card-container')).to.have.length(1);
    });

    it('renders loading alert when there is an error', () => {
        wrapper.setProps({isRttLoading: false, rttError: 'test error'});
        expect(wrapper.render().find('.loading-alert')).to.have.length(1);
    });
});
