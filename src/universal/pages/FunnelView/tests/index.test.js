import React from 'react';
import {render, act, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import {BrowserRouter as Router} from 'react-router-dom';
import FunnelView from '../';
import {EG_BRAND, EXPEDIA_BRAND} from '../../../constants';

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
            search: '',
            state: ''
        }),
    };
});

describe('FunnelView component testing', () => {
    beforeEach(() => {
        fetch.resetMocks();
    });

    it('renders successfully', async () => {
        await act(async () => {
            render(
                <Router>
                    <FunnelView selectedBrands={[EXPEDIA_BRAND]} />
                </Router>
            );
        });
        expect(screen.getByText(/Traveler Page Views/)).toBeInTheDocument();
        expect(screen.getByText(/Select View/)).toBeInTheDocument();
    });

    it('renders error message for expedia group brand', async () => {
        const message = 'Page views for Expedia Group is not yet available. The following brands are supported at this time: "Expedia", "Hotels.com Retail", and "Vrbo Retail". If you have any questions, please ping #opxhub-support or leave a comment via our Feedback form.';
        await act(async () => {
            render(
                <Router>
                    <FunnelView selectedBrands={[EG_BRAND]} />
                </Router>
            );
        });
        expect(screen.getByText(/Traveler Page Views/)).toBeInTheDocument();
        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(screen.getByText(message)).toBeInTheDocument();
    });
});
