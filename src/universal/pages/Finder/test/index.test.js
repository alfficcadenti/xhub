import React from 'react';
import {act} from '@testing-library/react';
import {mount} from 'enzyme';
import Finder from '../index';
import {EG_BRAND} from '../../../constants';
import {expect} from 'chai';
import {BrowserRouter as Router} from 'react-router-dom';

global.fetch = require('node-fetch');


describe('<Finder/>', () => {
    let wrapper;

    it('renders successfully', async () => {
        await act(async () => {
            wrapper = mount(
                <Router>
                    <Finder selectedBrands={[EG_BRAND]} onBrandChange={() => {}} prevSelectedBrand={EG_BRAND}/>
                </Router>
            );
        });
        expect(wrapper).to.have.length(1);
    });
});
