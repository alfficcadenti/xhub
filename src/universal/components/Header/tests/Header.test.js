import React from 'react';
import {mount} from 'enzyme';
import Header from '../index';
import {expect} from 'chai';
import sinon from 'sinon';
import {BRANDS} from '../../../constants';
import {BrowserRouter} from 'react-router-dom';


const validBrands = BRANDS.map((brand) => brand.label);

describe('<Header />', () => {
    it('renders Platform Health and Availability dropdown menus', () => {
        const wrapper = mount(<BrowserRouter><Header selectedBrands={['EG']} onBrandChange={sinon.spy} brands={validBrands} /></BrowserRouter>);
        expect(wrapper.find('[id="Platform Health & Resiliency-dropdown--container"]').children()).to.have.length(4);
        expect(wrapper.find('[id="Availability & Trends-dropdown--container"]').children()).to.have.length(3);
    });
});
