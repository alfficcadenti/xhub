import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';
import PieChart from '../';


describe('PieChart component testing', () => {
    it('renders successfully', () => {
        const wrapper = shallow(<PieChart data={[{name: 'name', value: 2}]} />);
        expect(wrapper).to.have.length(1);
        expect(wrapper.find('h3').children()).to.have.length(0);
    });

    it('renders title successfully', () => {
        const wrapper = shallow(<PieChart title="title" data={[{name: 'name', value: 2}]} />);
        expect(wrapper.find('h3').children()).to.have.length(1);
    });
});
