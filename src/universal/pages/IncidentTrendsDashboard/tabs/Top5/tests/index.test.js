import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';
import Top5 from '../Top5';
import mockData from './filteredData.test.json';

describe('<Top5 />', () => {
    it('renders No Result message when no data available', () => {
        const data = [];
        const wrapper = shallow(
            <Top5
                filteredIncidents={data}
            />
        );
        expect(wrapper.find('div').text()).to.eql('No Results Found');
    });

    it('renders 2 div for the TopLongest and TopShortest Duration', () => {
        const wrapper = shallow(
            <Top5
                filteredIncidents={mockData}
            />
        );
        const topLongTable = wrapper.find('#TopLongestDuration');
        const topShortTable = wrapper.find('#TopShortestDuration');
        expect(topLongTable).to.have.lengthOf(1);
        expect(topShortTable).to.have.lengthOf(1);
    });
});