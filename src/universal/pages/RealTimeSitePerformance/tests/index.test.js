import React from 'react';
import {shallow} from 'enzyme';
import {expect} from 'chai';
import RealTimeSitePerformance from '../index';
import {VRBO_BRAND} from '../../../constants';

describe('<RealTimeSitePerformance />', () => {
    it('renders successfully', () => {
        const wrapper = shallow(<RealTimeSitePerformance selectedBrands={[VRBO_BRAND]} />);
        expect(wrapper).to.have.length(1);
    });
});
