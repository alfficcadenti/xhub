import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme/build';
import Overview from '../Overview';
import NoResults from '../../../../../../components/NoResults/NoResults';
import mockData from './filteredData.test.json';

describe('<Overview />', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(
            <Overview startDate={'2019-09-01'} endDate={'2019-09-31'} filteredIncidents={mockData} />
        );
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('checks Overview component exists', () => {
        expect(wrapper).to.have.length(1);
    });

    it('passes as props the incidents data to the dataTable', () => {
        const props = wrapper.find('DataTable').props();
        expect(props.data[0].Brand).to.be.eql('Expedia Partner Solutions (EPS)');
        expect(props.data[0].P1).to.be.eql(1);
        expect(props.data[0].P2).to.be.eql(2);
        expect(props.data[0].Total).to.be.eql(3);
    });

    it('renders NoResults component when no data available', () => {
        wrapper.setProps({filteredIncidents: []});
        expect(wrapper.contains(<NoResults />)).to.equal(true);
    });
});
