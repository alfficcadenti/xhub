import React from 'react';
import {shallow} from 'enzyme';
import Availability from '../index';


describe('<Availability />', () => {
    it('renders successfully', () => {
        const wrapper = shallow(<Availability />);
        expect(wrapper).toHaveLength(1);
    });
});
