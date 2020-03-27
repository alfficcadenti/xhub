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

    it('passes as props the incidents data to the dataTable', () => {
        const props = wrapper.find('DataTable').props();
        const colConfig = {flex: {0: 0.5, 1: 0.5, 2: 0.5, 3: 0.5, 4: 0.5, 5: 2, 6: 1, 7: 0.5, 8: 0.8, 9: 0.7}};

        expect(props.tableConfig).to.be.eql({compact: true});
        expect(props.colConfig).to.be.eql(colConfig);
    });
});
