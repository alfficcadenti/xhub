import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';
import Quality from '../Quality';
import mockData from './filteredData.test.json';


describe('Quality component testing', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(
            <Quality filteredDefects={mockData}/>
        );
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('checks Quality component exists', () => {
        expect(wrapper).to.have.length(1);
    });

    it('passes as props the defects data to the dataTable', () => {
        const props = wrapper.find('DataTableWrapper').props();

        expect(props.filteredIncidents[0].defectSummary).to.be.eql('Tick box on cancellation LP fails to render on iOS');
        expect(props.filteredIncidents[0].defectNumber).to.be.eql('LASER-358');
        expect(props.filteredIncidents[0].openDate).to.be.eql('2020-03-21 12:38:57-05');
        expect(props.filteredIncidents[0].resolvedDate).to.be.eql('2020-03-22 09:02:00-05');
    });

    it('renders No Result message when no data available', () => {
        wrapper.setProps({filteredDefects: []});
        expect(wrapper.find('div').text()).to.eql('No Results Found');
    });
});
