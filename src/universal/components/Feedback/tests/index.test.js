import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';
import FeedbackModal from '../index';


describe('FeedbackModal component testing', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<FeedbackModal />);
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('checks FeedbackModal component exists', () => {
        expect(wrapper).to.have.length(1);
    });
});
