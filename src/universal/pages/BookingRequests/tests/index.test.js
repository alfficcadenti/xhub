import React from 'react';
import {shallow} from 'enzyme';
import {expect} from 'chai';
import BookingRequests from '../index';
import {HOTELS_COM_BRAND} from '../../../constants';

describe('<Booking Requests />', () => {
    it('renders successfully', () => {
        const wrapper = shallow(<BookingRequests selectedBrands={[HOTELS_COM_BRAND]} />);
        expect(wrapper).to.have.length(1);
    });
});
