import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';
import BarChartPanel from '../Panels/BarChartPanel';
import {getPanelDataUrl} from '../utils';

global.fetch = require('node-fetch');

describe('<BarChartPanel>', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(
            <BarChartPanel
                portfolios={['kes']}
                tickets={[]}
                dataUrl={getPanelDataUrl(['kes'], 'HCOM', 'opendefectspastsla')}
                dataKey="openDefectsPastSla"
            />);
    });

    it('renders successfully', () => {
        expect(wrapper).to.have.length(1);
    });
});
