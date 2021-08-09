import React from 'react';
import {shallow} from 'enzyme';
import {expect} from 'chai';
import Home from '../index';
import {EG_BRAND} from '../../../constants';


describe('<Home />', () => {
    it('renders successfully', () => {
        const wrapper = shallow(<Home selectedBrands={[EG_BRAND]} />);
        expect(wrapper).to.have.length(1);
    });
});
