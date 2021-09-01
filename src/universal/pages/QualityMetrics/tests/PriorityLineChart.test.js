import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';
import PriorityLineChartPanel from '../Panels/PriorityLineChartPanel';

global.fetch = require('node-fetch');

describe('<PriorityLineChartPanel>', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(
            <PriorityLineChartPanel
                title="P1 Created vs. Resolved"
                info="Charting P1 defects by their open date and resolve date (bucketed by week). Click line point for more details."
                tickets={[]}
                panelData={{data: [], isLoading: false, queries: [], error: null}}
            />);
    });

    it('renders successfully', () => {
        expect(wrapper).to.have.length(1);
    });
});
