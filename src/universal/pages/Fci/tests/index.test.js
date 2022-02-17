import React from 'react';
import Fci from '../index';
import {EXPEDIA_BRAND} from '../../../constants';
import {render, act, screen, fireEvent, waitFor} from '@testing-library/react';
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

    it('render successfully for the first time landing page',  async () =>{
        await act(async () => {
            wrapper = render(<Router><Fci selectedBrands={[EXPEDIA_BRAND]} /></Router>);
        });
        expect(wrapper).toMatchSnapshot();
    })

    it('it loads error codes after user click on error code radio button', async () => {
        const fetchMock = jest
            .spyOn(global, 'fetch')
            .mockImplementation(() =>
                Promise.resolve({ok: true, json: () => Promise.resolve([{'timestamp': '2022-02-16T10:00:00Z', 'counts': {'No Mapping Found': 32, 'CC Supply': 1}}])})
            );
        await act(async () => {
            wrapper = render(<Router><Fci selectedBrands={[EXPEDIA_BRAND]} /></Router>);
        });
        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock).toHaveBeenLastCalledWith(expect.stringContaining('/v1/checkout-failures/category-counts'));
        expect(wrapper.getByText(/Errors over Time/)).toBeInTheDocument();
        expect(wrapper.getByText(/all errors/i)).toBeInTheDocument();
        fireEvent.click(screen.getByText(/error code/i));
        expect(fetchMock).toHaveBeenNthCalledWith(2, expect.stringContaining('/v1/checkout-failures/error-counts'));
        expect(fetchMock).toHaveBeenNthCalledWith(3, expect.stringContaining('/v1/checkout-failures/error-codes'));
        expect(wrapper).toMatchSnapshot();
    });

});