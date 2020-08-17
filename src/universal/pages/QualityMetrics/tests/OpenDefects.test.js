import React from 'react';
import {expect} from 'chai';
import {mount} from 'enzyme';
import OpenDefects from '../Panels/OpenDefects';

global.fetch = require('node-fetch');

describe('<OpenDefects>', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(<OpenDefects portfolios={['kes']} tickets={[]} brand={'HCOM'} />);
    });

    it('renders successfully', () => {
        expect(wrapper).to.have.length(1);
    });
});
