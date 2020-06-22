import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme/build';
import Top5 from '../Top5';
import NoResults from '../../../../../../components/NoResults/NoResults';
import mockData from './filteredData.test.json';

describe('<Top5 />', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(
            <Top5 filteredIncidents={mockData} />
        );
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('checks Top5 component exists', () => {
        expect(wrapper).to.have.length(1);
    });

    it('renders 2 divs for the TopLongest and TopShortest Duration', () => {
        const topLongTable = wrapper.find('#TopLongestDuration');
        const topShortTable = wrapper.find('#TopShortestDuration');

        expect(topLongTable).to.have.lengthOf(1);
        expect(topShortTable).to.have.lengthOf(1);
    });

    it('renders NoResults component when no data available', () => {
        wrapper.setProps({filteredIncidents: []});
        expect(wrapper.contains(<NoResults />)).to.equal(true);
    });
});
