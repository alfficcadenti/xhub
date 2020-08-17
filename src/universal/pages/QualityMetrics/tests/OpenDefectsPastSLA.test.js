import React from 'react';
import {expect} from 'chai';
import {mount} from 'enzyme';
import OpenDefectsPastSLA from '../Panels/OpenDefectsPastSLA';

global.fetch = require('node-fetch');

describe('<OpenDefectsPastSLA>', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(<OpenDefectsPastSLA portfolios={['kes']} tickets={[]} brand={'HCOM'} />);
    });

    it('renders successfully', () => {
        expect(wrapper).to.have.length(1);
    });
});
