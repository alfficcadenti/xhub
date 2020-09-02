import React from 'react';
import {expect} from 'chai';
import {mount} from 'enzyme';
import BarChartPanel from '../Panels/BarChartPanel';
import {getPanelDataUrl} from '../utils';

global.fetch = require('node-fetch');

describe('<BarChartPanel>', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(
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