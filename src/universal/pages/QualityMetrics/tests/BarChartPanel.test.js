import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';
import BarChartPanel from '../Panels/BarChartPanel';

global.fetch = require('node-fetch');

describe('<BarChartPanel>', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(
            <BarChartPanel
                title="Open Defects"
                info="Displaying defects with status that is not 'Done', 'Closed', 'Resolved', 'In Production', or 'Archived' by portfolio"
                tickets={[]}
                panelData={{data: [], isLoading: false, queries: [], error: null}}
                portfolios={['kes']}
                dataKey="openDefectsPastSla"
            />);
    });

    it('renders successfully', () => {
        expect(wrapper).to.have.length(1);
    });
});
