import React from 'react';
import {shallow} from 'enzyme';
import HealthCheckBotResults from '../index';


describe('<HealthCheckBotResults />', () => {
    it('renders successfully', () => {
        const wrapper = shallow(<HealthCheckBotResults />);
        expect(wrapper).toHaveLength(1);
    });
});
