import React from 'react';
import {shallow} from 'enzyme';
import {expect} from 'chai';
import Overview from '../index';


describe('<Overview />', () => {
    it('renders successfully', () => {
        const wrapper = shallow(<Overview generateChartClickHandler={jest.fn()}/>);
        expect(wrapper).to.have.length(1);
    });
});
