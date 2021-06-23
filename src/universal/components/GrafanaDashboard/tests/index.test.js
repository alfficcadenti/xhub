import React from 'react';
import {shallow} from 'enzyme';
import GrafanaDashboard from '../index';

describe('<GrafanaDashboard /> ', () => {
    it('renders correctly', () => {
        const wrapper = shallow(<GrafanaDashboard />);
        expect(wrapper).toHaveLength(1);
    });
});