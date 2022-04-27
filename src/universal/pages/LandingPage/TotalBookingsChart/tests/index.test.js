import React from 'react';
import {shallow} from 'enzyme';
import TotalChart from '../index';
import {expect} from 'chai';
import {mockData} from '../../mock-bookings';

const selectedBrands = ['Expedia Group'];
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');

    return {
        ...originalModule,
        useHistory: jest.fn(),
        useLocation: () => ({
            pathname: '/test',
            hash: '',
            search: '',
            state: ''
        }),
    };
});

describe('<TotalBookingsChart />', () => {
    it('renders successfully', () => {
        const wrapper = shallow(<TotalChart data={mockData} brands={selectedBrands}/>);
        expect(wrapper).to.have.length(1);
    });

    it('renders the class .total-bookings-container', () => {
        const wrapper = shallow(<TotalChart data={mockData} brands={selectedBrands}/>);
        expect(wrapper.find('.total-bookings-container')).to.have.length(1);
    });
});
