import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';
import LineChart from '../';


describe('LineChart component testing', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(
            <LineChart />
        );
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('checks LineChart component exists', () => {
        expect(wrapper).to.have.length(1);
    });
});
