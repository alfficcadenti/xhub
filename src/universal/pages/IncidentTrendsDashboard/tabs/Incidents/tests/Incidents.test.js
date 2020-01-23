import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';
import Incidents from '../Incidents';
import mockData from './filteredData.test.json';

describe('<Incidents/>', () => {
    it('passes as props the incidents data to the dataTable', () => {
        const wrapper = shallow(
            <Incidents
                filteredIncidents={mockData}
            />
        );
        const props = wrapper.find('DataTable').props();
        expect(props.data[0].Incident).to.be.eql("<a key='INC4419505link' href='https://expedia.service-now.com/go.do?id=INC4419505' target='_blank'>INC4419505</a>");
        expect(props.data[0].Priority).to.be.eql('1-Critical');
        expect(props.data[0].Brand).to.be.eql('Expedia Partner Solutions (EPS)');
        expect(props.data[0].Duration).to.be.eql("<a name='1.3333333333333333'></a>a minute");
        expect(props.data[0]['Root Cause Owners']).to.be.eql('EAN Release - Deploy');
        expect(props.data[0].Status).to.be.eql('Closed');
    });
    it('renders No Result message when no data available', () => {
        const data = [];
        const wrapper = shallow(
            <Incidents
                filteredIncidents={data}
            />
        );
        expect(wrapper.find('div').text()).to.eql('No Results Found');
    });
});
