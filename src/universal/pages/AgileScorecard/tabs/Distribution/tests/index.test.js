import React from 'react';
import {render, act} from '@testing-library/react';
import Distribution from '../index';
import {MOCK_TEAMS} from '../../../tests/mockData';
import '@testing-library/jest-dom';


describe('<Distribution />', () => {
    let wrapper = '';
    beforeEach(async () => {
        fetch.resetMocks();
        await act(async () => {
            wrapper = render(<Distribution teams={MOCK_TEAMS} from="2021-11-21" to="2021-11-22" />);
        });
    });

    it('renders Error message when api return error', async () => {
        fetch.mockImplementation(() => {
            return Promise.resolve({
                ok: false,
                json: () => Promise.resolve([])
            });
        });
        expect(wrapper.getByText(/Error loading the distribution of work/)).toBeInTheDocument();
        expect(wrapper.getByRole('alert')).toBeInTheDocument();
        expect(wrapper).toMatchSnapshot();
    });
});