import React from 'react';
import {shallow} from 'enzyme';
import {expect} from 'chai';
import ResetButton from '../index';

describe('<ResetButton /> ', () => {
    it('renders successfully', () => {
        const wrapper = shallow(<ResetButton />);
        expect(wrapper).to.have.lengthOf(1);
    });
});
