import React from 'react';
import {render, fireEvent, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import LineChartWrapper from '../';

describe('<LineChartWrapper />', () => {
    it('renders correctly and enable/disable the line when click on the legend', () => {
        const onMouseDown = () => {};
        const onMouseMove = () => {};
        const onMouseUp = () => {};
        const onDotClick = () => {};
        const payload = [{
            color: '#3366cc',
            dataKey: 'Expedia',
            fill: '#fff',
            formatter: null,
            name: 'Expedia',
            payload: {
                'Egencia': 0,
                'Expedia': 905361,
                'Expedia Group': 0,
                'Expedia Partner Solutions': 0,
                'Hotels.com': 367080,
                'Vrbo': 972046,
                name: '2021-06-20',
            },
            stroke: '#3366cc',
            strokeWidth: 1,
            type: null,
            unit: null,
            value: 0,
        }];

        const wrapper = render(
            <LineChartWrapper
                width={700}
                height={300}
                title="title test" data={[{name: 'name', value: 'value'}]}
                keys={['value']}
                active
                selectedLine="Expedia"
                margin={{top: 5, right: 30, left: 20, bottom: 5}}
                cursor={onDotClick ? 'pointer' : ''}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                label="2021-06-20"
                payload={payload}
            />
        );

        expect(wrapper).toMatchSnapshot();
        expect(screen.getByTitle('title test')).toHaveClass('line-chart-wrapper');
        expect(screen.getByText('value')).toHaveClass('recharts-legend-item-text');
        expect(screen.getByText('value').closest('li')).not.toHaveClass('inactive');
        fireEvent.click(screen.getByText('value'));
        expect(screen.getByText('value').closest('li')).toHaveClass('inactive');
        fireEvent.click(screen.getByText('value'));
        expect(screen.getByText('value').closest('li')).not.toHaveClass('inactive');
    });

    it('renders correctly when data and keys are not passed', () => {
        const wrapper = render(
            <LineChartWrapper
                width={700}
                height={300}
                title="title test"
                active
                selectedLine="Expedia"
                margin={{top: 5, right: 30, left: 20, bottom: 5}}
                label="2021-06-20"
            />
        );
        expect(wrapper).toMatchSnapshot();
    });
});