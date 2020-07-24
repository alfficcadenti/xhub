import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';
import LineChartWrapper from '../';


describe('<LineChartWrapper />', () => {
    let wrapper;

    it('renders correctly', () => {
        wrapper = shallow(<LineChartWrapper data={[{name: 'name', value: 'value'}]} keys={['value']} />);
        expect(wrapper).to.have.length(1);
        expect(wrapper.find('h3').children()).to.have.length(0);
    });

    it('displays a title when passed in', () => {
        wrapper = shallow(<LineChartWrapper title="title" data={[{name: 'name', value: 'value'}]} keys={['value']} />);
        expect(wrapper).to.have.length(1);
        expect(wrapper.find('h3').children()).to.have.length(1);
    });
});
