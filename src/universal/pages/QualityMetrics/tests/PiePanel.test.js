import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';
import PiePanel from '../Panels/PiePanel';

global.fetch = require('node-fetch');

describe('<PiePanel>', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(
            <PiePanel
                title="Open Defects (w.r.t. Priority)"
                info="Charting all defects with regard to priority. Click pie slice for more details."
                groupBy="Priority"
                tickets={[]}
                panelData={{data: [], isLoading: false, queries: [], error: null}}
                portfolios={['kes']}
            />
        );
    });

    it('renders successfully', () => {
        expect(wrapper).to.have.length(1);
    });
});
