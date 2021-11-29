import React from 'react';
import {render, act} from '@testing-library/react';
import {shallow} from 'enzyme';
import StatusPage from '../index';
import {compareArraysElements} from '../utils';
import {CHECKOUT_FAILURE_SITES_MOCK_DATA} from './mockData/mockData';

describe('Status Page', () => {
    let wrapper;
    const c = new AbortController();

    beforeEach(() => {
        fetch.resetMocks();
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('renders successfully', () => {
        wrapper = shallow(<StatusPage />);
        expect(wrapper).toHaveLength(1);
    });

    it('After 5 seconds waiting for a response, the request should timeout and show an alert icon', async () => {
        jest.useFakeTimers();

        fetch.mockResponseOnce(async () => {
            jest.advanceTimersByTime(6000);
        });
        setTimeout(() => c.abort(), 5000);

        await act(async () => {
            wrapper = render(<StatusPage />);
        });

        await expect(() => fetch('/v1/checkout-failures/sites?from=2021-10-26T16:53:00Z&to=2021-10-26T16:53:06Z', {signal: c.signal})).toThrow('The operation was aborted.');

        expect(wrapper).toMatchSnapshot();
        jest.useRealTimers();
    });

    it('renders fail icon when incorrect response data doesn\'t match', async () => {
        fetch.mockImplementationOnce(() => {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve('www.orbitz.com')
            });
        });

        await act(async () => {
            wrapper = render(<StatusPage />);
        });

        expect(wrapper).toMatchSnapshot();
    });

    it('renders success icon when correct response data matches', async () => {
        fetch.mockImplementation(() => {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve(CHECKOUT_FAILURE_SITES_MOCK_DATA)
            });
        });

        await act(async () => {
            wrapper = render(<StatusPage />);
        });

        expect(wrapper).toMatchSnapshot();
    });

    it('fetches and calls all services', async () => {
        fetch.mockImplementation(() => {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve()
            });
        });

        await act(async () => {
            wrapper = render(<StatusPage />);
        });

        expect(fetch.mock.calls).toEqual([['/v1/checkout-failures/sites?from=2021-10-26T16:53:00Z&to=2021-10-26T16:53:06Z',
            {
                'signal': c.signal
            }
        ]]);
    });

    it('returns true - checks two arrays and matches - success', async () => {
        const arrayOne = ['www.expedia.com', 'www.travelocity.com'];
        const arrayTwo = ['www.travelocity.com', 'www.expedia.com'];

        const verifyCheck = compareArraysElements(arrayOne, arrayTwo);
        expect(verifyCheck).toEqual(true);
    });

    it('returns false - checks two arrays and doesn\'t match - fail', async () => {
        const arrayOne = ['www.expedia.com', 'www.travelocity.com'];
        const arrayTwo = ['www.orbitz.com', 'www.ebookers.com'];

        const verifyCheck = compareArraysElements(arrayOne, arrayTwo);
        expect(verifyCheck).toEqual(false);
    });
});
