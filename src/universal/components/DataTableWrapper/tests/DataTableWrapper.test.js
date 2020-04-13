import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';
import DataTableWrapper from '../DataTableWrapper';


describe('DataTableWrapper component testing', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(
            <DataTableWrapper />
        );
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('checks DataTableWrapper component exists', () => {
        expect(wrapper).to.have.length(1);
    });
});

