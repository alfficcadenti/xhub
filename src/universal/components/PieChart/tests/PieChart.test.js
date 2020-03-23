import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';
import PieChart from '../';


describe('PieChart component testing', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(
            <PieChart />
        );
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('checks PieChart component exists', () => {
        expect(wrapper).to.have.length(1);
    });
});
