import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';
import {DatetimeRangePicker} from '../index.js';


describe('DatetimeRangePicker component testing', () => {
    it('renders successfully', () => {
        const wrapper = shallow(<DatetimeRangePicker startDate={new Date()} endDate={new Date()} onChange={() => {}} />);
        expect(wrapper).to.have.length(1);
    });
});
