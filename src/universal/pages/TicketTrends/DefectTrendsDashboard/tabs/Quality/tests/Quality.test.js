import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme/build';
import Quality from '../Quality';
import NoResults from '../../../../../../components/NoResults';
import mockData from './filteredData.test.json';


describe('Quality component testing', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(
            <Quality filteredDefects={mockData} startDate={'2020-03-01'} endDate={'2020-03-30'} />
        );
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('checks Quality component exists', () => {
        expect(wrapper).to.have.length(1);
    });

    it('passes as props the defects data to the DataTable', () => {
        const props = wrapper.find('DataTable').props();
        const firstRow = props.data[0];

        expect(firstRow.Defect).to.be.eql(<a href="https://jira.expedia.biz/browse/LASER-358" target="_blank">{'LASER-358'}</a>);
        expect(firstRow.Priority).to.be.eql('3-Medium');
        expect(firstRow.Brand).to.be.eql('BEX - Expedia Group');
        // expect(firstRow.Opened).to.be.eql('2020-03-21 12:38'); // local conversation prone to error local vs build env
        // expect(firstRow.Resolved).to.be.eql('2020-03-22 09:02'); // local conversation prone to error local vs build env
        expect(firstRow.Summary).to.be.eql('Tick box on cancellation LP fails to render on iOS');
        expect(firstRow.Project).to.be.eql('LASER');
        expect(firstRow.Duration).to.be.eql('-');
        expect(firstRow['Impacted Brand']).to.be.eql('BEX');
        expect(firstRow.Status).to.be.eql('-');
    });

    it('renders NoResults component when no data available', () => {
        wrapper.setProps({filteredDefects: []});
        expect(wrapper.contains(<NoResults />)).to.equal(true);
    });
});
