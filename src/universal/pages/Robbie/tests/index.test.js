import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';
import Robbie from '../';


describe('<Robbie />', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<Robbie />);
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('renders successfully', () => {
        expect(wrapper).to.have.length(1);
    });
});
