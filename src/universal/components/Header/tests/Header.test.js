import React from 'react';
import Header from '../index';
import sinon from 'sinon';
import {BRANDS, EXPEDIA_BRAND, EG_BRAND, VRBO_BRAND} from '../../../constants';
import {BrowserRouter} from 'react-router-dom';
import {render, screen, fireEvent, within} from '@testing-library/react';
import '@testing-library/jest-dom';

const validBrands = BRANDS.map((brand) => brand.label);

describe('<Header />', () => {
    it('renders Platform Health and Availability dropdown menus if brand is Expedia Brand', () => {
        const wrapper = render(<BrowserRouter><Header selectedBrands={[EXPEDIA_BRAND]} onBrandChange={sinon.spy} brands={validBrands} /></BrowserRouter>);
        expect((wrapper.getAllByRole('dialog')[0]).children).toHaveLength(6); // Availability & Trends
        expect((wrapper.getAllByRole('dialog')[1]).children).toHaveLength(8); // Platform Health & Resiliency
    });

    it('renders only Platform Health dropdown menu if brand is EG GROUP', () => {
        const wrapper = render(<BrowserRouter><Header selectedBrands={[EG_BRAND]} onBrandChange={sinon.spy} brands={validBrands} /></BrowserRouter>);
        expect((wrapper.getAllByRole('dialog')[0]).children).toHaveLength(3); // Availability & Trends
        expect((wrapper.getAllByRole('dialog')[1]).children).toHaveLength(8); // Platform Health & Resiliency
    });

    it('renders Platform Health, Availability and CE Analysis dropdown menus if brand is VRBO', () => {
        const wrapper = render(<BrowserRouter><Header selectedBrands={[VRBO_BRAND]} onBrandChange={sinon.spy} brands={validBrands} /></BrowserRouter>);
        expect((wrapper.getAllByRole('dialog')[0]).children).toHaveLength(12); // Availavbility & Trends
        expect((wrapper.getAllByRole('dialog')[1]).children).toHaveLength(2); // CE Analysis
        expect((wrapper.getAllByRole('dialog')[3]).children).toHaveLength(9); // Platform Health & Resiliency
    });

    it('search box is not visible before click event', () => {
        const onChange = jest.fn();
        const wrapper = render(<BrowserRouter><Header selectedBrands={[EXPEDIA_BRAND]} onBrandChange={sinon.spy} brands={validBrands} onChange={onChange} /></BrowserRouter>);
        expect(wrapper).toMatchSnapshot();
        let input = screen.getByRole('searchbox');
        expect(input).toHaveClass('site-search-container');
        expect(input).not.toHaveClass('active');
        let button = within(input).getByRole('button');
        let searchText = within(input).getByTestId('searchtext');
        expect(searchText).not.toBeVisible();
        fireEvent.click(button);
        expect(input).toHaveClass('active');
        expect(searchText).toBeVisible();
    });
});
