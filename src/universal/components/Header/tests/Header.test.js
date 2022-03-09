import React from 'react';
import Header from '../index';
import sinon from 'sinon';
import {BRANDS, EXPEDIA_BRAND, EG_BRAND,VRBO_BRAND} from '../../../constants';
import {BrowserRouter} from 'react-router-dom';
import { render, screen, fireEvent } from '@testing-library/react';
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

    it('search box has no content before click event', () => {
        const onChange = jest.fn();
        const wrapper = render(<BrowserRouter><Header selectedBrands={[EXPEDIA_BRAND]} onBrandChange={sinon.spy} brands={validBrands} onChange={onChange} /></BrowserRouter>);
        expect(wrapper).toMatchSnapshot();
        let input = screen.queryByRole(/textbox/);
        expect(input).not.toHaveTextContent;
        fireEvent.click(input);
        expect(input).toHaveTextContent;
    });

    it('text input value changes after making selection', () => {
        const onChange = jest.fn();
        const wrapper = render(<BrowserRouter><Header selectedBrands={[EXPEDIA_BRAND]} onBrandChange={sinon.spy} brands={validBrands} onChange={onChange} /></BrowserRouter>);
        expect(wrapper).toMatchSnapshot();
        let input = screen.queryAllByRole(/textbox/);
        expect(input).toHaveLength(1);
        expect(input).not.toHaveTextContent;
        fireEvent.change(screen.queryAllByRole(/textbox/)[0], {target: {value: 'Home'}});
        expect(input[0]).toHaveValue('Home');
    })
});
