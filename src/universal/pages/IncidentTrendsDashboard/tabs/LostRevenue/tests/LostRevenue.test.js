import React from 'react';
import {shallow} from 'enzyme';
import LostRevenue from '../LostRevenue';
import mockData from './lostRevenueData.test.json';


describe('<LostRevenue />', () => {
    it('renders successfully', () => {
        shallow(<LostRevenue filteredLostRevenues={mockData} />);
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
