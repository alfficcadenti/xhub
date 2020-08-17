import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme/build';
import Incidents from '../Incidents';
import mockData from './filteredData.test.json';
import NoResults from '../../../../../../components/NoResults/NoResults';


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

    it('passes as props the incidents data to the DataTable', () => {
        const props = wrapper.find('DataTable').props();
        const firstRow = props.data[0];

        expect(firstRow.Incident).to.be.eql(<a href="https://expedia.service-now.com/go.do?id=INC4624976" target="_blank">{'INC4624976'}</a>);
        expect(firstRow.Priority).to.be.eql('2-High');
        expect(firstRow.Brand).to.be.eql('BEX - Expedia Group');
        expect(firstRow.Division).to.be.eql('Platform & Marketplaces');
        // expect(firstRow.Started).to.be.eql('2020-01-02 13:17'); // local conversation prone to error local vs build env
        expect(firstRow.Summary).to.be.eql('Multiple Contact Centers SynApps Degraded');
        expect(firstRow.Duration.toString().replace(/\s/g, '')).to.be.eql('<divvalue=279840000>3d5h44m</div>');
        expect(firstRow.TTD.toString().replace(/\s/g, '')).to.be.eql('<divvalue=1200000>20m</div>');
        expect(firstRow.TTR.toString().replace(/\s/g, '')).to.be.eql('<divvalue=278640000>3d5h24m</div>');
        expect(firstRow.Status).to.be.eql('Closed');
        expect(firstRow['Executive Summary']).to.be.eql('Multiple Contact Centers SynApps Degraded');
        expect(firstRow['Resolution Notes']).to.be.eql('CUCM Chandler response time was higher so Synapps request timed out. But CUCM continued processing the request partially and both the system became out of sync.CUCM PHX instance has better response time and now Synapps is pointing to same instance. After this, team cleaned up both CUCM and Synapps devices which were in bad state. Post cleanup, re-provisioning was successful. ');
    });

    it('renders NoResults component when no data available', () => {
        wrapper.setProps({filteredIncidents: []});
        expect(wrapper.contains(<NoResults />)).to.equal(true);
    });
});
