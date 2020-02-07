import React from 'react';
import {shallow} from 'enzyme';
import FinancialImpact from '../FinancialImpact';
import mockData from './lostRevenueData.test.json';


describe('<FinancialImpact />', () => {
    it('renders successfully', () => {
        const wrapper = shallow(<FinancialImpact filteredIncidents={mockData} />);
        expect(wrapper).toHaveLength(1);
    });

    it('renders No Result message when no data available', () => {
        const data = [];
        const wrapper = shallow(
            <FinancialImpact
                filteredIncidents={data}
            />
        );
        expect(wrapper.find('div').text()).toEqual('No Results Found');
    });
});