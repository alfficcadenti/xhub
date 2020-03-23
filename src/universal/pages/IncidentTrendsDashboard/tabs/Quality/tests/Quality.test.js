import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';
import Quality from '../Quality';
import mockData from './filteredData.test.json';

describe('<Quality/>', () => {
    it('passes as props the defects data to the dataTable', () => {
        const wrapper = shallow(
            <Quality
                filteredDefects={mockData}
            />
        );
        const props = wrapper.find('DataTable').props();
        expect(props.data[0].Defect).to.be.eql(<a key="INC4419505link" href="https://expedia.service-now.com/go.do?id=INC4419505" target="_blank">INC4419505</a>);
        expect(props.data[0].Priority).to.be.eql('1-Critical');
        expect(props.data[0].Status).to.be.eql('Closed');
    });
    it('renders No Result message when no data available', () => {
        const data = [];
        const wrapper = shallow(
            <Quality
                filteredDefects={data}
            />
        );
        expect(wrapper.find('div').text()).to.eql('No Results Found');
    });
});
