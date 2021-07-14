import React from 'react';
import {shallow, mount} from 'enzyme';
import {expect} from 'chai';
import BookingRequests from '../index';
import {HOTELS_COM_BRAND} from '../../../constants';
import {BrowserRouter} from 'react-router-dom';

describe('<Booking Requests />', () => {
    it('renders successfully', () => {
        const wrapper = shallow(<BookingRequests selectedBrands={[HOTELS_COM_BRAND]} />);
        expect(wrapper).to.have.length(1);
    });

    it('renders iframe element', () => {
        const wrapper = mount(<BrowserRouter><BookingRequests selectedBrands={[HOTELS_COM_BRAND]} availableBrands={[HOTELS_COM_BRAND]} /></BrowserRouter>);
        expect(wrapper.find('iframe')).to.have.length(1);
    });
});
