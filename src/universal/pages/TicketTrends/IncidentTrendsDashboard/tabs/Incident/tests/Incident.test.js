import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme/build';
import {Incident} from '../..';
import mockData from './filteredData.test.json';

global.fetch = require('node-fetch');

describe('Incident component testing', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow( // render only my component's direct output by mocking child components
            <Incident ticket={mockData}/>
        );
        fetch
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('renders successfully', () => {
        expect(wrapper).to.have.length(1);
    });

    it('shows no incident data after searching for 0 incidents', () => {
        expect(fetch).toHaveBeenCalledWith(stringContaining('/v1/incidents/${}'));
    })
// trigger useEffect function and mock fetch

    // it('LoadingContainer should have right props', async () => {
    //     console.log(wrapper.html());
    //     const props = wrapper.find('LoadingContainer').props();
    
    //     expect(props.isLoading).equal(true);
    // });

    // it('passes as props the incident data to the DataTable', () => {
    //     const props = wrapper.find('DataTable').props();

    //     expect(props.Incident).to.be.eql(<a href="https://expedia.service-now.com/go.do?id=INC5997738" target="_blank">{'INC5997738'}</a>);
    //     expect(props.Priority).to.be.eql('1-Critical');
    //     expect(props['Booking Impact']).to.be.eql('Severe Booking Impact');
    //     expect(props.TTD.toString().replace(/\s/g, '')).to.be.eql('<divvalue=11>11m</div>');
    //     expect(props.TTK.toString().replace(/\s/g, '')).to.be.eql('<divvalue=6>6m</div>');
    //     expect(props.TTF.toString().replace(/\s/g, '')).to.be.eql('<divvalue=0>0m</div>');
    //     expect(props.TTR.toString().replace(/\s/g, '')).to.be.eql('<divvalue=17>17m</div>');
    //     expect(props['Executive Summary']).to.be.eql('-');
    //     expect(props['Resolution Notes']).to.be.eql('Service was restored without any technical intervention by support team. Egencia Payment Team will lead root cause investigation.');
    // });
});