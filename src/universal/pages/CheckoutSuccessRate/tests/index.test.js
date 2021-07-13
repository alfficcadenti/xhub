import React from 'react';
import {shallow, mount} from 'enzyme';
import {expect} from 'chai';
import CheckoutSuccessRate from '../index';
import {EG_BRAND} from '../../../constants';
import {BrowserRouter} from 'react-router-dom';


describe('<CheckoutSuccessRate />', () => {
    it('renders successfully', () => {
        const wrapper = shallow(<CheckoutSuccessRate selectedBrands={[EG_BRAND]} />);
        expect(wrapper).to.have.length(1);
    });

    it('renders iframe element', () => {
        const wrapper = mount(<BrowserRouter><CheckoutSuccessRate selectedBrands={[EG_BRAND]} availableBrands={[EG_BRAND]} /></BrowserRouter>);
        expect(wrapper.find('iframe')).to.have.length(1);
    });
});
