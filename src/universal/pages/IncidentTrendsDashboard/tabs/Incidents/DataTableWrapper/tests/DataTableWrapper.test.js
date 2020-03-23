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
        const colConfig = {flex: {0: 0.5, 1: 0.5, 2: 0.7, 3: 1, 4: 0.5, 5: 1.3, 6: 0.5, 7: 0.5, 8: 0.5, 9: 0.8, 10: 0.5, 11: 0.5}};

        expect(props.rowConfig).to.be.eql({expandable: true});
        expect(props.tableConfig).to.be.eql({compact: true});
        expect(props.colConfig).to.be.eql(colConfig);
    });
});
