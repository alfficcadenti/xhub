import React from 'react';
import {render, act, screen, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import DataTable from '../index';

describe('<DataTable/>', () => {
    let wrapper;
    let columns;
    let data;
    let rules;

    beforeEach(() => {
        columns = ['name'];
        data = [
            {name: 'B'},
            {name: 'A'},
            {name: 'D'},
            {name: 'C'}
        ];
        rules = [
            {
                column: 'name',
                setClass: (val) => val !== null ? 'some-class' : 'other-class'
            }
        ];
    });

    it('Renders successfully', async () => {
        await act(async () => {
            wrapper = render(<DataTable handleDateRangeChange={() => {}} handleClearDates={() => {}} data={data} columns={columns} rules={rules}/>);
        });
        expect(wrapper).toMatchSnapshot();
    });

    it('Renders successfully without download link and filter when no data', async () => {
        await act(async () => {
            wrapper = render(<DataTable handleDateRangeChange={() => {}} handleClearDates={() => {}} data={[]} columns={columns} rules={rules}/>);
        });
        expect(wrapper).toMatchSnapshot();
    });

    it('Sorts correctly', async () => {
        await act(async () => {
            wrapper = render(<DataTable handleDateRangeChange={() => {}} handleClearDates={() => {}} data={data} columns={columns} rules={rules}/>);
        });
        fireEvent.click(screen.getByRole('button'));
        expect(wrapper).toMatchSnapshot();
    });

    it('Sorts numbers correctly', async () => {
        await act(async () => {
            wrapper = render(<DataTable handleDateRangeChange={() => {}} handleClearDates={() => {}} data={[{name: '99'}, {name: '2010'}, {name: '1009'}, {name: '99'}]} columns={columns} rules={rules}/>);
        });
        fireEvent.click(screen.getByText(/name/i));
        expect(wrapper).toMatchSnapshot();
    });

    it('Sorts percentages correctly', async () => {
        await act(async () => {
            wrapper = render(<DataTable handleDateRangeChange={() => {}} handleClearDates={() => {}} data={[{name: '1.9%'}, {name: '3.99%'}, {name: '20.0%'}]} columns={columns} rules={rules}/>);
        });
        fireEvent.click(screen.getByText(/name/i));
        expect(wrapper).toMatchSnapshot();
    });

    it('Handles empty rules successfully', async () => {
        await act(async () => {
            wrapper = render(<DataTable handleDateRangeChange={() => {}} handleClearDates={() => {}} data={data} columns={columns} rules={[]}/>);
        });
        fireEvent.click(screen.getByText(/name/i));
        expect(wrapper).toMatchSnapshot();
    });

    it('Does not sort when sort is disabled', async () => {
        await act(async () => {
            wrapper = render(<DataTable sortDisabled handleDateRangeChange={() => {}} handleClearDates={() => {}} data={data} columns={columns} rules={[]}/>);
        });
        fireEvent.click(screen.getByText(/name/i));
        expect(wrapper).toMatchSnapshot();
    });
});
