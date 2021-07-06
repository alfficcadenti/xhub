import React from 'react';
import {shallow} from 'enzyme';
import {expect} from 'chai';
import ShoppingFencePostEvents from '../index';
import {VRBO_BRAND} from '../../../constants';

describe('<ShoppingFencePostEvents />', () => {
    it('renders successfully', () => {
        const wrapper = shallow(<ShoppingFencePostEvents selectedBrands={[VRBO_BRAND]} availableBrands={[VRBO_BRAND]} />);
        expect(wrapper).to.have.length(1);
    });
});
