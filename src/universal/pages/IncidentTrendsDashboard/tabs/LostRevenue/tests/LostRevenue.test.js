import React from 'react';
import {shallow} from 'enzyme';
import LostRevenue from '../LostRevenue';
import mockData from './lostRevenueData.test.json';


describe('<LostRevenue />', () => {
    it('renders successfully', () => {
        shallow(<LostRevenue filteredLostRevenues={mockData} />);
    });

    it('length of line should be equal to brands length', () => {
        const wrapper = shallow(
            <LostRevenue
                filteredLostRevenues={mockData}
            />
        );
        expect(wrapper.find('Line')).toHaveLength(1);
    });

    it('first line should be equal to first brand', () => {
        const wrapper = shallow(
            <LostRevenue
                filteredLostRevenues={mockData}
            />
        );

        const props = wrapper.find('Line').first().props();

        expect(props.dataKey).toBe('Expedia');
    });

    it('renders No Result message when no data available', () => {
        const data = [];
        const wrapper = shallow(
            <LostRevenue
                filteredLostRevenues={data}
            />
        );
        expect(wrapper.find('div').text()).toEqual('No Results Found');
    });
});
