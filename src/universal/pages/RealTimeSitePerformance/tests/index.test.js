import React from 'react';
import {shallow, mount} from 'enzyme';
import {expect} from 'chai';
import RealTimeSitePerformance from '../index';
import {VRBO_BRAND} from '../../../constants';
import {BrowserRouter} from 'react-router-dom';

describe('<RealTimeSitePerformance />', () => {
    it('renders successfully', () => {
        const wrapper = shallow(<RealTimeSitePerformance selectedBrands={[VRBO_BRAND]} />);
        expect(wrapper).to.have.length(1);
    });

    it('renders iframe element', () => {
        const wrapper = mount(<BrowserRouter><RealTimeSitePerformance selectedBrands={[VRBO_BRAND]} availableBrands={[VRBO_BRAND]} /></BrowserRouter>);
        expect(wrapper.find('iframe')).to.have.length(1);
    });
});
