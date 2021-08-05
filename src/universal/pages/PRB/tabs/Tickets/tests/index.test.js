import React from 'react';
import {shallow} from 'enzyme';
import {expect} from 'chai';
import Tickets from '../index';
import {EG_BRAND} from '../../../../../constants';


describe('<Tickets />', () => {
    it('renders successfully', () => {
        const wrapper = shallow(<Tickets selectedBrands={[EG_BRAND]} />);
        expect(wrapper).to.have.length(1);
    });
});
