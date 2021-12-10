import React from 'react';
import {shallow} from 'enzyme/build';
import {Incident} from '../..';
import mockData from './filteredData.test.json';
import {render, act, fireEvent, getByLabelText, getByText} from '@testing-library/react';
import userEvent from '@testing-library/user-event';


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
            fireEvent.change(input, {target: {value: 'INC123'}})
            fireEvent.click(wrapper.getByText('Search'));
        });

        expect(wrapper).toMatchSnapshot();
    });

});