import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';
import OngoingIncidents from '../index';


describe('OngoingIncidents component testing', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<OngoingIncidents incidents={[]} onClose={() => {}} />);
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('checks OngoingIncidents component exists', () => {
        expect(wrapper).to.have.length(1);
    });
});
