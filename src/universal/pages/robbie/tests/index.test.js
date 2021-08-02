import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';
import robbie from '../';


describe('robbie component testing', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<robbie />);
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('renders successfully', () => {
        expect(wrapper).to.have.length(1);
    });
});
