import React from 'react';
import {mount} from 'enzyme';
import Header from '../index';
import {expect} from 'chai';
import sinon from 'sinon';
import {BRANDS, EXPEDIA_BRAND, EG_BRAND, VRBO_BRAND} from '../../../constants';
import {BrowserRouter} from 'react-router-dom';


const validBrands = BRANDS.map((brand) => brand.label);

describe('<Header />', () => {
    it('renders Platform Health and Availability dropdown menus', () => {
        const wrapper = mount(<BrowserRouter><Header selectedBrands={[EXPEDIA_BRAND]} onBrandChange={sinon.spy} brands={validBrands} /></BrowserRouter>);
        expect(wrapper.find('[id="Platform Health & Resiliency-dropdown--container"]').children()).to.have.length(6);
        expect(wrapper.find('[id="Availability & Trends-dropdown--container"]').children()).to.have.length(4);
    });

    it('renders only Platform Health dropdown menu if brand is EG GROUP', () => {
        const wrapper = mount(<BrowserRouter><Header selectedBrands={[EG_BRAND]} onBrandChange={sinon.spy} brands={validBrands} /></BrowserRouter>);
        expect(wrapper.find('[id="Platform Health & Resiliency-dropdown--container"]').children()).to.have.length(6);
        expect(wrapper.find('[id="Availability & Trends-dropdown--container"]').children()).to.have.length(1);
    });

    it('renders Platform Health, Availability and CE Analysis dropdown menus if brand is VRBO', () => {
        const wrapper = mount(<BrowserRouter><Header selectedBrands={[VRBO_BRAND]} onBrandChange={sinon.spy} brands={validBrands} /></BrowserRouter>);
        expect(wrapper.find('[id="Platform Health & Resiliency-dropdown--container"]').children()).to.have.length(7);
        expect(wrapper.find('[id="Availability & Trends-dropdown--container"]').children()).to.have.length(8);
        expect(wrapper.find('[id="Customer Experience Analysis-dropdown--container"]').children()).to.have.length(2);
    });
});
