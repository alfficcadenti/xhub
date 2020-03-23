import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';
import Incidents from '../Incidents';
import mockData from './filteredData.test.json';


describe('Incidents component testing', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(
            <Incidents filteredIncidents={mockData}/>
        );
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('checks Incidents component exists', () => {
        expect(wrapper).to.have.length(1);
    });

    it('passes as props the incidents data to the dataTable', () => {
        const props = wrapper.find('DataTableWrapper').props();

        expect(props.filteredIncidents[0].incidentSummary).to.be.eql('Multiple Contact Centers SynApps Degraded');
        expect(props.filteredIncidents[0].incidentNumber).to.be.eql('INC4624976');
        expect(props.filteredIncidents[0].startedAt).to.be.eql('2020-01-02 19:17:00.0000000');
        expect(props.filteredIncidents[0].openDate).to.be.eql('2019-12-31 00:37:41.0000000');
        expect(props.filteredIncidents[0].resolvedDate).to.be.eql('2020-01-06 03:47:50.0000000');
        expect(props.filteredIncidents[0].rootCause).to.be.eql('CUCM Chandler response time was higher so Synapps request timed out. But CUCM continued processing the request partially and both the system became out of sync.CUCM PHX instance has better response time and now Synapps is pointing to same instance. After this, team cleaned up both CUCM and Synapps devices which were in bad state. Post cleanup, re-provisioning was successful. ');
    });

    it('renders No Result message when no data available', () => {
        wrapper.setProps({filteredIncidents: []});
        expect(wrapper.find('div').text()).to.eql('No Results Found');
    });
});
