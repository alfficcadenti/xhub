import React from 'react';
import AvailabilityCell from '../AvailabilityCell';
import {render, fireEvent, screen} from '@testing-library/react';
import '@testing-library/jest-dom';

describe('<availabilityCell />', () => {
    it('renders empty div when no value is passed', async () => {
        const wrapper = render(<AvailabilityCell/>);
        expect(wrapper).toMatchSnapshot();
    });

    it('renders cell with class negative when value below 99', async () => {
        const wrapper = render(<AvailabilityCell value={99}/>);
        expect(wrapper.container.querySelector('div').className).toBe('negative');
        expect(wrapper).toMatchSnapshot();
    });

    it('renders cell with class attention when value beetween 99.5 and 99.99', async () => {
        const wrapper = render(<AvailabilityCell value={99.7}/>);
        expect(wrapper.container.querySelector('div').className).toBe('attention');
        expect(wrapper).toMatchSnapshot();
    });

    it('renders cell with class positive when value is above or equal to 99.99', async () => {
        const wrapper = render(<AvailabilityCell value={99.99}/>);
        expect(wrapper.container.querySelector('div').className).toBe('positive');
        expect(wrapper).toMatchSnapshot();
    });

    it('pass the application Name to the function when clicked', async () => {
        const handleClick = jest.fn();
        const wrapper = render(<AvailabilityCell value={99.99} applicationName={'test'} handleClick={handleClick}/>);
        fireEvent.click(screen.getByText(/99.99/i));
        expect(wrapper).toMatchSnapshot();
        expect(handleClick).toHaveBeenCalledTimes(1);
        expect(handleClick).toHaveBeenCalledWith('test');
    });
});
