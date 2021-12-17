import React from 'react';
import {shallow} from 'enzyme/build';
import {Incident} from '../..';
import mockData from './filteredData.test.json';
import {render, act, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';


describe('Incident component testing', () => {
    let wrapper;

    beforeEach(() => {
        fetch.resetMocks();
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('renders successfully', () => {
        wrapper = shallow(<Incident />);
        expect(wrapper).toHaveLength(1);
    });

    it('returns mocked data', async () => {
        fetch.mockImplementation(async () => {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockData)
            });
        });
        await act(async () => {
            wrapper = render(<Incident />);
            const input = wrapper.getByLabelText('Search incident by ID');
            fireEvent.change(input, {target: {value: 'INC123'}});
        });
        await act(async () => {
            await fireEvent.click(wrapper.getByText('Search'));
        });

        expect(wrapper).toMatchSnapshot();
    });

    it('returns error', async () => {
        fetch.mockImplementation(async () => {
            return Promise.resolve({
                ok: false,
                json: () => Promise.resolve([])
            });
        });
        await act(async () => {
            wrapper = render(<Incident />);
            const input = wrapper.getByLabelText('Search incident by ID');
            fireEvent.change(input, {target: {value: 'INC123'}});
        });
        await act(async () => {
            await fireEvent.click(wrapper.getByText('Search'));
        });
        expect(wrapper.getByText('Failed to retrieve data. Try refreshing the page. If the problem persists, please message #opxhub-support or fill out our Feedback form.')).toBeInTheDocument();
        expect(wrapper).toMatchSnapshot();
    });
});