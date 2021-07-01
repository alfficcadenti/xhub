import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';
import CreatedVsResolvedPanel from '../Panels/CreatedVsResolvedPanel';

global.fetch = require('node-fetch');

describe('<CreatedVsResolvedPanel>', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(
            <CreatedVsResolvedPanel
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
