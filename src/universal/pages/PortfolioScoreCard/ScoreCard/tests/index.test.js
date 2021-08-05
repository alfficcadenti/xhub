import React from 'react';
import {shallow} from 'enzyme';
import {expect} from 'chai';
import ScoreCard from '../index';
import {EG_BRAND} from '../../../../constants';


describe('<ScoreCard />', () => {
    it('renders successfully', () => {
        const wrapper = shallow(<ScoreCard selectedBrands={[EG_BRAND]} />);
        expect(wrapper).to.have.length(1);
    });
});
