import React from 'react';
import {DatetimeRangePicker} from '../index.js';
import {render, fireEvent, act, screen, within} from '@testing-library/react';
import '@testing-library/jest-dom';
import moment from 'moment';


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

    it('close the calendar when click outside', async () => {
        const onChange = jest.fn();
        await act(async () => {
            render(<DatetimeRangePicker startDate={dates.start} endDate={dates.end} onChange={onChange} />);
        });
        let inputs = screen.queryAllByRole(/textbox/);
        expect(inputs[0]).not.toHaveClass('active');
        fireEvent.click(inputs[0]);
        expect(inputs[0]).toHaveClass('active');
        fireEvent.click(screen.getAllByText('26')[0]);
        expect(inputs[1]).toHaveClass('active');
        fireEvent.mouseDown(document);
        expect(inputs[1]).not.toHaveClass('active');
    });

    it('assign a start date when user input in textboxes', async () => {
        const onChange = jest.fn();
        await act(async () => {
            render(<DatetimeRangePicker startDate={dates.start} endDate={dates.end} onChange={onChange} />);
        });
        let inputs = screen.queryAllByRole(/textbox/);
        expect(onChange).toHaveBeenCalledTimes(1);
        fireEvent.click(inputs[0]);
        fireEvent.change(screen.queryAllByRole(/textbox/)[0], {target: {value: '2021-12-26'}});
        expect(onChange).toHaveBeenCalledTimes(2);
        expect(screen.queryByLabelText('Start')).toHaveFocus();
        fireEvent.change(screen.queryAllByRole(/textbox/)[1], {target: {value: '2022-02-28'}});
        expect(screen.queryByLabelText('End')).toHaveFocus();
        expect(onChange).toHaveBeenCalledTimes(3);
        expect(onChange).toHaveBeenLastCalledWith(finalDates);
        fireEvent.keyUp(screen.queryAllByRole(/textbox/)[1], {key: 'Enter', code: 13, charCode: 13});
        expect(screen.queryByLabelText('Start')).not.toHaveFocus();
        expect(screen.queryByLabelText('End')).not.toHaveFocus();
    });

    it('assigns a start date 1 day before the end date if the user select an end date which is earlier than the current start date', async () => {
        const onChange = jest.fn();
        const finalValidDates = {end: new Date('2022-02-28'), start: new Date('2022-02-27')};
        await act(async () => {
            render(<DatetimeRangePicker startDate={dates.start} endDate={dates.end} onChange={onChange} />);
        });
        let inputs = screen.queryAllByRole(/textbox/);
        expect(onChange).toHaveBeenCalledTimes(1);
        fireEvent.click(inputs[0]);
        fireEvent.change(screen.queryAllByRole(/textbox/)[0], {target: {value: '2022-03-26'}});
        expect(onChange).toHaveBeenCalledTimes(2);
        fireEvent.change(screen.queryAllByRole(/textbox/)[1], {target: {value: '2022-02-28'}});
        expect(onChange).toHaveBeenCalledTimes(3);
        expect(onChange).toHaveBeenLastCalledWith(finalValidDates);
    });

    it('assigns a start date 1 hour before the end date if the user select an end date which is earlier than the current start date and the time format is available', async () => {
        const onChange = jest.fn();
        const finalValidDates = {end: new Date('2022-02-28 04:32'), start: new Date('2022-02-28 03:32')};
        await act(async () => {
            render(<DatetimeRangePicker startDate={dates.start} endDate={dates.end} onChange={onChange} showTimePicker/>);
        });
        let inputs = screen.queryAllByRole(/textbox/);
        expect(onChange).toHaveBeenCalledTimes(1);
        fireEvent.click(inputs[0]);
        fireEvent.change(screen.queryAllByRole(/textbox/)[0], {target: {value: '2022-03-26 05:40'}});
        expect(onChange).toHaveBeenCalledTimes(2);
        fireEvent.change(screen.queryAllByRole(/textbox/)[1], {target: {value: '2022-02-28 04:32'}});
        expect(onChange).toHaveBeenCalledTimes(3);
        expect(onChange).toHaveBeenLastCalledWith(finalValidDates);
    });

    it('assigns a end date 1 hour after the start date if the user select a start date which is later than the current end date and the time format is available', async () => {
        const onChange = jest.fn();
        const finalValidDates = {end: new Date('2022-05-28 05:32'), start: new Date('2022-05-28 04:32')};
        await act(async () => {
            render(<DatetimeRangePicker startDate={dates.start} endDate={dates.end} onChange={onChange} showTimePicker/>);
        });
        let inputs = screen.queryAllByRole(/textbox/);
        fireEvent.click(inputs[0]);
        fireEvent.change(screen.queryAllByRole(/textbox/)[0], {target: {value: '2022-05-28 04:32'}});
        expect(onChange).toHaveBeenLastCalledWith(finalValidDates);
    });

    it('assigns new end date if user click on end date input textbox before selecting a date from the calendar', async () => {
        const onChange = jest.fn();
        const finalValidDates = {end: new Date('2022-02-26'), start: new Date('2022-01-01')};
        await act(async () => {
            render(<DatetimeRangePicker startDate={dates.start} endDate={dates.end} onChange={onChange} />);
        });
        let inputs = screen.queryAllByRole(/textbox/);
        fireEvent.click(inputs[1]);
        fireEvent.click(screen.getAllByText('26')[0]);
        expect(onChange).toHaveBeenLastCalledWith(finalValidDates);
    });

    it('updates start and end date if user select a preset timeframe', async () => {
        const onChange = jest.fn();
        const lastWeek = moment().subtract(1, 'week').startOf('day').toDate();
        const today = moment().endOf('day').toDate();
        const finalValidDates = {end: today, start: lastWeek};
        await act(async () => {
            render(<DatetimeRangePicker startDate={dates.start} endDate={dates.end} onChange={onChange} />);
        });
        let preset = screen.queryByRole('dialog');
        fireEvent.click(preset);
        fireEvent.click(within(preset).getAllByRole('presentation')[0]);
        expect(onChange).toHaveBeenLastCalledWith(finalValidDates, 'Last 7 Days');
    });
});
