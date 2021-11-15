import React from 'react';
import {render, act, screen} from '@testing-library/react';
import {shallow} from 'enzyme';
import '@testing-library/jest-dom/extend-expect';
import chaiJestSnapshot from 'chai-jest-snapshot';
import StatusPage from '../index';
import {check} from '../utils';
import {CHECKOUT_FAILURE_SITES_MOCK_DATA} from '../ListOfService';

describe('Status Page', () => {
    let wrapper;
    // const listOfService = ListOfService;

    beforeAll(() => {
        chaiJestSnapshot.resetSnapshotRegistry();
    });

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

    it('renders success icon when correct response data matches', async () => {
        fetch.mockImplementation(() => {
            return Promise.resolve({
                json: () => Promise.resolve(CHECKOUT_FAILURE_SITES_MOCK_DATA)
            });
        });


        await act(async () => {
            wrapper = await render(<StatusPage />);
        });
        expect(wrapper).toMatchSnapshot();
        screen.debug();

    });

    it('renders fail icon when incorrect response data doesn\'t match', async () => {
        fetch.mockImplementation(() => {
            return Promise.reject({
                json: () => Promise.reject()
            });
        });


        await act(async () => {
            wrapper = await render(<StatusPage />);
        });
        expect(wrapper).toMatchSnapshot();
        screen.debug();
        chaiJestSnapshot.resetSnapshotRegistry();
    });

    it('fetches and calls all services', async () => {
        fetch.mockImplementation(() => {
            return Promise.resolve({});
        });

        await act(async () => {
            render(<StatusPage />);
        });

        expect(fetch.mock.calls).toEqual([['/v1/checkout-failures/sites?from=2021-10-26T16:53:00Z&to=2021-10-26T16:53:06Z'], ['/v1/checkout-failures/sites?from=2021-10-20T10:10:00Z&to=2021-10-20T10:10:30Z']]);
    });

    it('returns true - checks two arrays and matches - success', async () => {
        const arrayOne = ['www.expedia.com', 'www.travelocity.com'];
        const arrayTwo = ['www.travelocity.com', 'www.expedia.com'];

        const verifyCheck = check(arrayOne, arrayTwo);
        expect(verifyCheck).toEqual(true);
    });

    it('returns false - checks two arrays and doesn\'t match - fail', async () => {
        const arrayOne = ['www.expedia.com', 'www.travelocity.com'];
        const arrayTwo = ['www.orbitz.com', 'www.ebookers.com'];

        const verifyCheck = check(arrayOne, arrayTwo);
        expect(verifyCheck).toEqual(false);
    });
});
