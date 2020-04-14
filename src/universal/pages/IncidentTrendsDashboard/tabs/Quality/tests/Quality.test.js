import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';
import Quality from '../Quality';
import NoResults from '../../../../../components/NoResults/NoResults';
import mockData from './filteredData.test.json';


describe('Quality component testing', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(
            <Quality filteredDefects={mockData} startDate={'2020-03-01'} endDate={'2020-03-30'} selectedCovidTag={false} />
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

    it('renders NoResults component when no data available', () => {
        wrapper.setProps({filteredDefects: []});
        expect(wrapper.contains(<NoResults />)).to.equal(true);
    });
});
