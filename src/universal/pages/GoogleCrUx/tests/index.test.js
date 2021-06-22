import React from 'react';
import {shallow} from 'enzyme';
import {expect} from 'chai';
import GoogleCrUx from '../index';
import {EG_BRAND} from '../../../constants';

describe('<SalesForceCases />', () => {
    it('renders successfully', () => {
        const wrapper = shallow(<GoogleCrUx selectedBrands={[EG_BRAND]} />);
        expect(wrapper).to.have.length(1);
    });
});
