import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';
import PieChart from '../';


describe('PieChart component testing', () => {
    let wrapper;

    afterEach(() => {
        wrapper.unmount();
    });

    it('renders successfully', () => {
        wrapper = shallow(<PieChart />);
        expect(wrapper).to.have.length(1);
        expect(wrapper.find('h3').children()).to.have.length(0);
    });

    it('renders title successfully', () => {
        wrapper = shallow(<PieChart title="title" data={[{name: 'name', value: 2}]} />);
        expect(wrapper.find('h3').children()).to.have.length(1);
    });
});
