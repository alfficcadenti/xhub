import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';
import DataTable from '../index';

describe('<DataTable/>', () => {
    let wrapper;
    let columns;
    let data;
    let rules;

    beforeEach(() => {
        columns = ['name'];
        data = [
            {name: 'B'},
            {name: 'A'},
            {name: 'D'},
            {name: 'C'}
        ];
        rules = [
            {
                column: 'name',
                setClass: (val) => val !== null
            }
        ];
        wrapper = shallow(<DataTable handleDateRangeChange={() => {}} handleClearDates={() => {}} data={data} columns={columns} rules={rules} />);
    });

    it('Renders successfully', () => {
        expect(wrapper).to.have.length(1);
    });

    it('Sorts correctly', () => {
        wrapper.setProps({data, columns, rules});
        wrapper.instance().onClickSort(columns[0]);
        expect(wrapper.instance().state.data[0].name).to.equal('D');
        wrapper.instance().onClickSort(columns[0]);
        expect(wrapper.instance().state.data[0].name).to.equal('A');
        wrapper.instance().onClickSort(columns[0]);
        expect(wrapper.instance().state.data[0].name).to.equal('D');
    });

    it('Sorts numbers correctly', () => {
        wrapper.setProps({data: [{name: '99'}, {name: '2010'}, {name: '1009'}], columns, rules});
        expect(wrapper.instance().state.data[0].name).to.equal('99');
        wrapper.instance().onClickSort(columns[0]);
        expect(wrapper.instance().state.data[0].name).to.equal('2010');
        wrapper.instance().onClickSort(columns[0]);
        expect(wrapper.instance().state.data[0].name).to.equal('99');
        wrapper.instance().onClickSort(columns[0]);
        expect(wrapper.instance().state.data[0].name).to.equal('2010');
    });

    it('Sorts percentages correctly', () => {
        wrapper.setProps({data: [{name: '1.9%'}, {name: '3.99%'}, {name: '20.0%'}], columns, rules});
        expect(wrapper.instance().state.data[0].name).to.equal('1.9%');
        wrapper.instance().onClickSort(columns[0]);
        expect(wrapper.instance().state.data[0].name).to.equal('20.0%');
        wrapper.instance().onClickSort(columns[0]);
        expect(wrapper.instance().state.data[0].name).to.equal('1.9%');
        wrapper.instance().onClickSort(columns[0]);
        expect(wrapper.instance().state.data[0].name).to.equal('20.0%');
    });

    it('Handles empty rules successfully', () => {
        wrapper.instance().setState({rules: []});
        expect(wrapper.instance().applyRule(null, null)).to.equal('');
    });

    it('Does not sort when sort is disabled', () => {
        wrapper = shallow(<DataTable data={data} columns={columns} rules={rules} sortDisabled />);
        wrapper.instance().onClickSort(columns[0]);
        expect(wrapper.instance().state.data[0].name).to.equal('B');
        wrapper.instance().onClickSort(columns[0]);
        expect(wrapper.instance().state.data[0].name).to.equal('B');
    });
});
