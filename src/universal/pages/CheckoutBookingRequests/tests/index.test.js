import React from 'react';
import {shallow} from 'enzyme';
import {expect} from 'chai';
import CheckoutBookingRequests from '../index';
import {HOTELS_COM_BRAND} from '../../../constants';

describe('<CheckoutBookingRequests />', () => {
    it('renders successfully', () => {
        const wrapper = shallow(<CheckoutBookingRequests selectedBrands={[HOTELS_COM_BRAND]} />);
        expect(wrapper).to.have.length(1);
    });
});
