import React from 'react';
import {shallow} from 'enzyme';
import {expect} from 'chai';
import BlipDashBoard from '../index';


describe('<BlipDashBoard />', () => {
    it('renders successfully', () => {
        const wrapper = shallow(<BlipDashBoard />);
        expect(wrapper).to.have.length(1);
    });
});
