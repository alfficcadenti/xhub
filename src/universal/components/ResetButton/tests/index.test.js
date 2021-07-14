import React from 'react';
import {shallow} from 'enzyme';
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
        expect(wrapper).toHaveLength(1);
    });

    it('reset button should be disabled with isDisabled prop true', () => {
        wrapper.setProps({isDisabled: true});
        expect(wrapper.find('.reset-btn').props().disabled).toEqual(true);
    });

    it('reset button should be enabled with isDisabled prop false', () => {
        wrapper.setProps({isDisabled: false});
        expect(wrapper.find('.reset-btn').props().disabled).toEqual(false);
    });

    it('calls onClick function', () => {
        const resetGraphToDefault = jest.fn();

        wrapper.setProps({isDisabled: false, resetGraphToDefault});
        wrapper.simulate('click');
        expect(resetGraphToDefault).toHaveBeenCalledTimes(1);
    });
});
