import React from 'react';
import {shallow} from 'enzyme';
import {expect} from 'chai';
import ResetButton from '../index';


describe('<ResetButton /> ', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<ResetButton isDisabled />);
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('renders successfully', () => {
        expect(wrapper).to.have.length(1);
    });

    it('reset button should be disabled with isDisabled prop true', () => {
        wrapper.setProps({isDisabled: true});
        expect(wrapper.find('.reset-btn').props().disabled).to.be.eql(true);
    });

    it('reset button should be enabled with isDisabled prop false', () => {
        wrapper.setProps({isDisabled: false});
        expect(wrapper.find('.reset-btn').props().disabled).to.be.eql(false);
    });
});
