import React from 'react';
import {expect} from 'chai';
import {BrowserRouter as Router} from 'react-router-dom';
import {render, act, screen} from '@testing-library/react';
import SuccessRates from '../';
import {EGENCIA_BRAND} from '../../../constants';
import {getBrandUnsupportedMessage} from '../utils';


global.fetch = require('node-fetch');
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');

    return {
        ...originalModule,
        useHistory: () => ({
            push: jest.fn(),
        }),
        useLocation: () => ({
            pathname: '/test',
            hash: '',
            search: '?selectedBrand=Expedia&view=Native%20View&metric=Login%20Success%20Rates',
            state: ''
        }),
    };
});

const original = console.error;

beforeEach(() => {
    console.error = jest.fn();
});

afterEach(() => {
    console.error = original;
});

describe('SuccessRates Dashboard', () => {
    it('renders error message for unsupported brands', async () => {
        await act(async () => {
            render(
                <Router>
                    <SuccessRates selectedBrands={[EGENCIA_BRAND]} onBrandChange={() => {}} />
                </Router>
            );
        });
        const inputs = screen.getByText(/Success rates for Egencia is not yet available/);
        expect(inputs.innerHTML).equal(getBrandUnsupportedMessage(EGENCIA_BRAND));
    });
});
