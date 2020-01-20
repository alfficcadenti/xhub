import React from 'react';
import {shallow} from 'enzyme';
import sinon from 'sinon';
import FilterDropDown from '../index';

const props = {
    id: 'priority-dropdown',
    selectedValue: 'All - P1 & P2',
    list: ['P1', 'P2'],
    onClickHandler: sinon.spy(),
};

describe('<FilterDropDown /> ', () => {
    it('renders correctly', () => {
        const wrapper = shallow(<FilterDropDown {...props} />);
        expect(wrapper).toHaveLength(1);
    });
});