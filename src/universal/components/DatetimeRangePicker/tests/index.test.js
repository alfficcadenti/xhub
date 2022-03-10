import React from 'react';
import {DatetimeRangePicker} from '../index.js';
import {render, fireEvent, act, screen} from '@testing-library/react';
import '@testing-library/jest-dom';


describe('DatetimeRangePicker component testing', () => {
    const dates = {end: new Date('2022-02-01'), start: new Date('2022-01-01')};
    const finalDates = {end: new Date('2022-02-28'), start: new Date('2021-12-26')};
    it('renders successfully 2 inputs (start and end)', async () => {
        const wrapper = render(<DatetimeRangePicker startDate={dates.start} endDate={dates.end} onChange={() => {}} />);
        expect(wrapper).toMatchSnapshot();
        expect(wrapper.getByLabelText('Start')).toBeInTheDocument();
        expect(wrapper.getByLabelText('End')).toBeInTheDocument();
    });

    it('assign the active class when an input node is clicked by the user', async () => {
        const onChange = jest.fn();
        await act(async () => {
            render(<DatetimeRangePicker startDate={dates.start} endDate={dates.end} onChange={onChange} />);
        });
        let inputs = screen.queryAllByRole(/textbox/);
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(inputs[0]).not.toHaveClass('active');
        fireEvent.click(inputs[0]);
        expect(inputs[0]).toHaveClass('active');
        fireEvent.click(screen.getAllByText('26')[0]);
        expect(onChange).toHaveBeenCalledTimes(2);
    });

    it('assign the active class when an input node is clicked by the user', async () => {
        const onChange = jest.fn();
        await act(async () => {
            render(<DatetimeRangePicker startDate={dates.start} endDate={dates.end} onChange={onChange} />);
        });
        let inputs = screen.queryAllByRole(/textbox/);
        expect(inputs[0]).not.toHaveClass('active');
        fireEvent.click(inputs[0]);
        expect(inputs[0]).toHaveClass('active');
        fireEvent.click(screen.getAllByText('26')[0]);
        fireEvent.click(screen.getAllByText('28')[0]);
        expect(inputs[0]).not.toHaveClass('active');
        expect(onChange).toHaveBeenLastCalledWith(finalDates);
    });
});
