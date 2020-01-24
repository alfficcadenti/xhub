import React from 'react';
import {shallow} from 'enzyme';
import LostRevenue from '../LostRevenue';
import mockData from './lostRevenueData.test.json';

describe('<LostRevenue />', () => {
    it('renders successfully', () => {
        shallow(<LostRevenue/>);
    });

    it('passes as props the lostRevenue data to the chart', () => {
        const wrapper = shallow(
            <LostRevenue
                lostRevenues={mockData}
            />
        );
        const props = wrapper.find('LineChart').props();
        expect(props.data[0].Hotels).toBe(45496);
        expect(props.data[0].Hotwire).toBe(5288);
        expect(props.data[0].Wotif).toBe(410);
        expect(props.data[0].ebookers).toBe(1248);
        expect(props.data[0].weekInterval).toBe('2019-10-28');
    });

    it('length of line should be equal to brands length', () => {
        const wrapper = shallow(
            <LostRevenue
                brands={[
                    'Hotels',
                    'Expedia',
                    'EAN'
                ]}
            />
        );
        expect(wrapper.find('Line')).toHaveLength(3);
    });

    it('first line should be equal to first brand', () => {
        const wrapper = shallow(
            <LostRevenue
                brands={[
                    'Hotels',
                    'Expedia',
                    'EAN'
                ]}
            />
        );

        const props = wrapper.find('Line').first().props();

        expect(props.dataKey).toBe('Hotels');
    });
});
