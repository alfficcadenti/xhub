import React from 'react';
import CGPAvailibility from '../index';
import {AVAILABILITY} from '../../../../server/routes/api/testData/availability';
import {render, act, fireEvent, waitFor, within, screen} from '@testing-library/react';
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

    it('renders Error Message when backend service returned 400', async () => {
        fetch.mockImplementation(() => {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({timestamp: '2022-04-07T08:36:48.217+00:00', status: 400, error: 'Bad Request'})
            });
        });
        await act(async () => {
            wrapper = render(<Router><CGPAvailibility /></Router>);
        });
        expect(wrapper.getByText(/Error loading CGP Availability. Try refreshing the page/)).toBeInTheDocument();
    });

    it('renders error message only when availability filter input is higher than 100', async () => {
        fetch.mockImplementation(() => {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve(AVAILABILITY)
            });
        });
        await act(async () => {
            wrapper = render(<Router><CGPAvailibility /></Router>);
        });
        const inputField = wrapper.getByLabelText('Availability Filter');
        fireEvent.change(inputField, {target: {value: '101'}});
        expect(wrapper.getByText(/Invalid value, 0 - 100 only/)).toBeInTheDocument();
        expect(wrapper).toMatchSnapshot();
        fireEvent.change(inputField, {target: {value: '99'}});
        await waitFor(() => {
            expect(wrapper.queryByText('Invalid value, 0 - 100 only')).not.toBeInTheDocument();
        });
        expect(wrapper).toMatchSnapshot();
    });

    it('renders error message only when availability filter input is lower than 0', async () => {
        fetch.mockImplementation(() => {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve(AVAILABILITY)
            });
        });
        await act(async () => {
            wrapper = render(<Router><CGPAvailibility /></Router>);
        });
        const inputField = wrapper.getByLabelText('Availability Filter');
        fireEvent.change(inputField, {target: {value: '-1'}});
        expect(wrapper.getByText(/Invalid value, 0 - 100 only/)).toBeInTheDocument();
        expect(wrapper).toMatchSnapshot();
        fireEvent.change(inputField, {target: {value: '1'}});
        await waitFor(() => {
            expect(wrapper.queryByText('Invalid value, 0 - 100 only')).not.toBeInTheDocument();
        });
        expect(wrapper).toMatchSnapshot();
    });

    it('excludes unknown application from the availability table', async () => {
        fetch.mockImplementation(() => {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve(AVAILABILITY)
            });
        });
        await act(async () => {
            wrapper = render(<Router><CGPAvailibility /></Router>);
        });
        expect(wrapper.queryByText('unknown')).not.toBeInTheDocument();
    });

    it('display only application with name including the substring in the application filter', async () => {
        fetch.mockImplementation(() => {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve(AVAILABILITY)
            });
        });
        await act(async () => {
            wrapper = render(<Router><CGPAvailibility /></Router>);
        });
        const inputField = wrapper.getByLabelText('Application Name');
        fireEvent.change(inputField, {target: {value: 'cars'}});
        const table = screen.getByLabelText('DataTable');
        const rows = within(table);
        expect(rows.getAllByRole('row')).toHaveLength(3);

        expect(wrapper).toMatchSnapshot();
    });
});


