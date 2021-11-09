import React from 'react';
import {render, act, screen, waitFor} from '@testing-library/react';
import {shallow} from 'enzyme';
import '@testing-library/jest-dom/extend-expect';
import chaiJestSnapshot from 'chai-jest-snapshot';
import StatusPage from '../index';
import {checkoutFailureSitesMockData} from './mockData/mockData';

describe('Status Page', () => {
    let wrapper;

    beforeEach(() => {
        fetch.resetMocks();
        chaiJestSnapshot.setFilename(`${__filename}.snap`);
        wrapper = shallow(<StatusPage />);
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('renders successfully', () => {
        expect(wrapper).toHaveLength(1);
    });

    it('matches the snapshot when status returns 200', async () => {
        fetch.mockImplementation(() => {
            return Promise.resolve({
                status: 200,
            });
        });

        await act(async () => {
            chaiJestSnapshot.setTestName('matches the snapshot');
            wrapper = await render(<StatusPage />);
        });
        expect(wrapper).toMatchSnapshot();
    });

    it('checks CheckoutFailureSites endpoint by default', async () => {
        fetch.mockImplementation(() => {
            return Promise.resolve({
                status: 200
            });
        });

        await act(async () => {
            render(<StatusPage />);
        });

        expect(fetch.mock.calls.length).toEqual(1);
        expect(fetch.mock.calls[0][0][0]).toEqual('/v1/checkout-failures/sites?from=2021-10-26T16:53:00Z&to=2021-10-26T16:53:06Z');
    });

    it('renders success icon when status code returns 200', async () => {
        fetch.mockImplementation(() => {
            return Promise.resolve({
                status: 200
            });
        });

        fetch('/v1/checkout-failures/sites?from=2021-10-20T10:10:00.000Z&to=2021-10-20T10:10:01.000Z');

        await waitFor(async () => render(<StatusPage />));
        await waitFor(() => expect(screen.getByTestId('successIcon')).toBeTruthy());
        await waitFor(() => expect(screen.queryByTestId('failIcon')).not.toBeInTheDocument());
    });

    it('renders fail icon when status code doesn\'t return 200', async () => {
        fetch.mockImplementation(() => {
            return Promise.resolve({
                status: 404
            });
        });


        fetch('/v1/checkout-failures/sites?from=2021-10-20T10:10:00.000Z&to=2021-10-20T10:10:01.000Z');
        await waitFor(async () => render(<StatusPage />));

        await waitFor(() => expect(screen.getByTestId('failIcon')).toBeTruthy());
        await waitFor(() => expect(screen.queryByTestId('successIcon')).not.toBeInTheDocument());
    });

    it('CheckoutFailureSites endpoint returns correct data', async () => {
        fetch.mockImplementation(() => {
            return Promise.resolve({
                status: 200,
                json: () => {
                    return Promise.resolve(
                        checkoutFailureSitesMockData
                    );
                }
            });
        });

        const res = await fetch('/v1/checkout-failures/sites?from=2021-10-20T10:10:00.000Z&to=2021-10-20T10:10:01.000Z');
        const json = await res.json();
        await waitFor(async () => render(<StatusPage />));

        expect(json).toEqual(checkoutFailureSitesMockData);
    });
});
