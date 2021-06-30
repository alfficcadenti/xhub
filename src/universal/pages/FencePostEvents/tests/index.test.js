import React from 'react';
import {shallow} from 'enzyme';
import {expect} from 'chai';
import FencePostEvents from '../index';
import {HOTELS_COM_BRAND} from '../../../constants';

describe('<FencePostEvents />', () => {
    it('renders successfully', () => {
        const wrapper = shallow(<FencePostEvents selectedBrands={[HOTELS_COM_BRAND]} />);
        expect(wrapper).to.have.length(1);
    });
});
