import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';
import FinancialImpact from '../FinancialImpact';
import NoResults from '../../../../../components/NoResults/NoResults';
import mockData from './lostRevenueData.test.json';


describe('FinancialImpact component testing', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(
            <FinancialImpact filteredIncidents={mockData} />
        );
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('renders successfully', () => {
        expect(wrapper).to.have.length(1);
    });

    it('renders NoResults component when no data available', () => {
        wrapper.setProps({filteredIncidents: []});
        expect(wrapper.contains(<NoResults />)).to.equal(true);
    });
});
