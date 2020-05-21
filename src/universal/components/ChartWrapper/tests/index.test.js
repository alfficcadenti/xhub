import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';
import ChartWrapper from '../index';


describe('ChartWrapper component testing', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<ChartWrapper />);
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('checks ChartWrapper component exists', () => {
        expect(wrapper).to.have.length(1);
    });
});
