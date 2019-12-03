import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';
import Overview from '../Overview';
import mockData from './filteredData.test.json';

describe('<Overview />', () => {
    it('passes as props the incidents data to the dataTable', () => {
        const wrapper = shallow(
            <Overview
                filteredIncidents={mockData}
            />
        );
        const props = wrapper.find('DataTable').props();
        expect(props.data[0].Brand).to.be.eql('Expedia Partner Solutions (EPS)')
        expect(props.data[0].P1).to.be.eql(1)
        expect(props.data[0].P2).to.be.eql(2)
        expect(props.data[0].Total).to.be.eql(3)
    });
    it('renders No Result message when no data available', () => {
        const data = [];
        const wrapper = shallow(
            <Overview
                filteredIncidents={data}
            />
        );
        expect(wrapper.find('div').text()).to.eql('No Results Found');
    });
});