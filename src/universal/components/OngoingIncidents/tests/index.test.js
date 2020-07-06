import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';
import OngoingIncidents from '../index';
import {EG_BRAND} from '../../../constants';


describe('OngoingIncidents component testing', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<OngoingIncidents selectedBrands={[EG_BRAND]} />);
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('checks OngoingIncidents component exists', () => {
        expect(wrapper).to.have.length(1);
    });
});
