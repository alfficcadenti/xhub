import React from 'react';
import {shallow} from 'enzyme';
import {expect} from 'chai';
import InitialBookings from '../index';
import {VRBO_BRAND} from '../../../constants';

describe('<Initial Bookings />', () => {
    it('renders successfully', () => {
        const wrapper = shallow(<InitialBookings selectedBrands={[VRBO_BRAND]} />);
        expect(wrapper).to.have.length(1);
    });
});
