import React from 'react';
import {render, act} from '@testing-library/react';
import {shallow} from 'enzyme';
import StatusPage from '../index';
import {compareObjArraysElements} from '../utils';
import {INCIDENTS_EXPECTED_DATA} from './mockData/mockData';

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
        fetch.mockImplementation(() => {
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
                json: () => Promise.resolve(INCIDENTS_EXPECTED_DATA)
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

        expect(fetch.mock.calls).toEqual([
            ['/v1/checkout-failures/sites?from=2021-10-26T16:53:00Z&to=2021-10-26T16:53:06Z', {'signal': c.signal}],
            ['v1/incidents?from_datetime=2021-10-28T05:31:00Z&to_datetime=2021-10-28T16:31:00Z', {'signal': c.signal}]
        ]);
    });

    it('compareObjArraysElements returns true when two arrays match', async () => {
        const arrayOne = ['www.expedia.com', 'www.travelocity.com'];
        const arrayTwo = ['www.travelocity.com', 'www.expedia.com'];

        const verifyCheck = compareObjArraysElements(arrayOne, arrayTwo);
        expect(verifyCheck).toEqual(true);
    });

    it('compareObjArraysElements returns false when two arrays doesn\'t match', async () => {
        const arrayOne = ['www.expedia.com', 'www.travelocity.com'];
        const arrayTwo = ['www.orbitz.com', 'www.ebookers.com'];

        const verifyCheck = compareObjArraysElements(arrayOne, arrayTwo);
        expect(verifyCheck).toEqual(false);
    });

    it('compareObjArraysElements returns false when 2 objects doesn\'t match', async () => {
        const objectOne = {
            'booking_impact': 'Moderate Booking Impact',
            'brand': 'Expedia Services',
            'degradation_outage': 'Degradation',
            'duration': '106',
            'end_date': '2021-10-18 19:11:00.0000000 +00:00',
            'environment': 'Production',
            'estimated_gross_loss': null,
            'estimated_order_loss': null,
            'estimated_revenue_loss': null
        };
        const objectTwo = {
            'booking_impact': 'Moderate Booking Impact',
            'brand': 'Total Retail',
            'degradation_outage': 'Degradation',
            'duration': '106',
            'end_date': '2021-10-18 19:11:00.0000000 +00:00',
            'environment': 'Production',
            'estimated_gross_loss': null,
            'estimated_order_loss': null,
            'estimated_revenue_loss': null
        };
        const arr1 = [objectOne];
        const arr2 = [objectTwo];
        const verifyCheck = compareObjArraysElements(arr1, arr2);
        expect(verifyCheck).toEqual(false);
    });

    it('compareObjArraysElements returns true when 2 objects match', async () => {
        const objectOne = {
            'booking_impact': 'Moderate Booking Impact',
            'brand': 'Total Retail',
            'degradation_outage': 'Degradation',
            'duration': '106',
            'end_date': '2021-10-18 19:11:00.0000000 +00:00',
            'environment': 'Production',
            'estimated_gross_loss': null,
            'estimated_order_loss': null,
            'estimated_revenue_loss': null
        };
        const objectTwo = {
            'booking_impact': 'Moderate Booking Impact',
            'brand': 'Total Retail',
            'degradation_outage': 'Degradation',
            'duration': '106',
            'end_date': '2021-10-18 19:11:00.0000000 +00:00',
            'environment': 'Production',
            'estimated_gross_loss': null,
            'estimated_order_loss': null,
            'estimated_revenue_loss': null
        };
        const arr1 = [objectOne];
        const arr2 = [objectTwo];
        const verifyCheck = compareObjArraysElements(arr1, arr2);
        expect(verifyCheck).toEqual(true);
    });
});
