import React from 'react';
import CGPAvailibility from '../index';
import {AVAILABILITY} from '../../../../server/routes/api/testData/availability';
import {render, act} from '@testing-library/react';
import '@testing-library/jest-dom';
import {BrowserRouter as Router} from 'react-router-dom';


jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');

    return {
        ...originalModule,
        useLocation: () => ({
            pathname: '/cgp-availability',
            hash: '',
            search: '',
            state: ''
        }),
    };
});

describe('<CGPAvailibility />', () => {
    let wrapper = '';
    beforeEach(() => {
        fetch.resetMocks();
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('renders Error message when api return error', async () => {
        fetch.mockImplementation(() => {
            return Promise.resolve({
                ok: false,
                json: () => Promise.resolve([])
            });
        });
        await act(async () => {
            wrapper = render(<Router><CGPAvailibility /></Router>);
        });
        expect(wrapper.getByText(/Error loading CGP Availability. Try refreshing the page/)).toBeInTheDocument();
        expect(wrapper.getByRole('alert')).toBeInTheDocument();
        expect(wrapper).toMatchSnapshot();
    });

    it('renders a table and match the snapshot when data are passed correctly', async () => {
        fetch.mockImplementation(() => {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve(AVAILABILITY)
            });
        });
        await act(async () => {
            wrapper = render(<Router><CGPAvailibility /></Router>);
        });
        expect(wrapper).toMatchSnapshot();
    });

    it('renders NO RESULTS FOUND and match the snapshot when data are empty', async () => {
        fetch.mockImplementation(() => {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve([])
            });
        });
        await act(async () => {
            wrapper = render(<Router><CGPAvailibility /></Router>);
        });
        expect(wrapper.getByText(/NO RESULTS FOUND/)).toBeInTheDocument();
        expect(wrapper).toMatchSnapshot();
    });
});


