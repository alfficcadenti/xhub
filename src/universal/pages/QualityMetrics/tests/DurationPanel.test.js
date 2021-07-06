import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';
import DurationPanel from '../Panels/DurationPanel';

global.fetch = require('node-fetch');

describe('<BarChartPanel>', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(
            <DurationPanel
                title="Mean Time to Resolve By Portfolio"
                info="Mean time to resolve in days by portfolio"
                tickets={[]}
                panelData={{data: [], isLoading: false, queries: [], error: null}}
                portfolios={['kes']}
            />);
    });

    it('renders successfully', () => {
        expect(wrapper).to.have.length(1);
    });
});
