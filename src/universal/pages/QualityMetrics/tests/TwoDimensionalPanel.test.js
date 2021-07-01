import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';
import TwoDimensionalPanel from '../Panels/TwoDimensionalPanel';

global.fetch = require('node-fetch');

describe('<TwoDimensionalPanel>', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(
            <TwoDimensionalPanel
                title="Open Defects"
                info="Displaying defects with status that is not 'Done', 'Closed', 'Resolved', 'In Production', or 'Archived'"
                tickets={[]}
                panelData={{data: [], isLoading: false, queries: [], error: null}}
                portfolios={['kes']}
                dataKey="openBugs"
                brand="Vrbo"
            />
        );
    });

    it('renders successfully', () => {
        expect(wrapper).to.have.length(1);
    });
});
