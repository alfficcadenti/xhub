import React from 'react';
import {shallow} from 'enzyme';
import {expect} from 'chai';
import Bots from '../index';
import {HOTELS_COM_BRAND} from '../../../constants';

describe('<Bots />', () => {
    it('renders successfully', () => {
        const wrapper = shallow(<Bots selectedBrands={[HOTELS_COM_BRAND]} />);
        expect(wrapper).to.have.length(1);
    });
});
