import React from 'react';
import Fci from '../index';
import {EXPEDIA_BRAND} from '../../../constants';
import {render, act, screen, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import {BrowserRouter as Router} from 'react-router-dom';

jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');

    return {
        ...originalModule,
        useLocation: () => ({
            pathname: '/Fci',
            hash: '',
            search: '',
            state: ''
        }),
    };
});

describe('<Fci/>', () => {
    let wrapper = '';

    beforeEach(() => {
        fetch.resetMocks();
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('render successfully for the first time landing page', async () => {
        await act(async () => {
            wrapper = render(<Router><Fci selectedBrands={[EXPEDIA_BRAND]} /></Router>);
        });
        expect(wrapper).toMatchSnapshot();
    });

    it('it loads error codes after user click on error code dropdown', async () => {
        const fetchMock = jest
            .spyOn(global, 'fetch')
            .mockImplementation(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(
                        [{'timestamp': '2022-02-16T10:00:00Z', 'counts': {'No Mapping Found': 32, 'CC Supply': 1}}]
                    )
                })
            );
        await act(async () => {
            wrapper = render(<Router><Fci selectedBrands={[EXPEDIA_BRAND]} /></Router>);
        });
        expect(fetchMock).toHaveBeenNthCalledWith(1, expect.stringContaining('/v1/checkout-failures/error-counts'));
        expect(wrapper.getByText(/Errors over Time/)).toBeInTheDocument();
        await act(async () => {
            fireEvent.click(screen.queryAllByText(/Chart by Error Code/i)[0]);
            fireEvent.click(screen.queryAllByText(/Chart by Category/i)[0]);
        });
        expect(fetchMock).toHaveBeenNthCalledWith(2, expect.stringContaining('/v1/checkout-failures/error-categories'));
        expect(wrapper).toMatchSnapshot();
    });
});