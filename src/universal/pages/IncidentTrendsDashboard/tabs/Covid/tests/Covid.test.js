import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';
import Covid from '../Covid';
import mockData from '../../Incidents/tests/filteredData.test';


describe('Covid component testing', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(
            <Covid filteredIncidents={mockData}/>
        );
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('checks Covid component exists', () => {
        expect(wrapper).to.have.length(1);
    });

    it('renders No Result message when no data available', () => {
        wrapper.setProps({filteredIncidents: []});
        expect(wrapper.find('div').text()).to.eql('No Results Found');
    });
});
