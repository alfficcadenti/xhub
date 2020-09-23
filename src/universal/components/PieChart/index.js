import React from 'react';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend
} from 'recharts';
import {CHART_COLORS} from '../../constants';
import NoResults from '../NoResults';
import './styles.less';

const PieChartWrapper = ({
    title,
    data = [],
    dataKey = 'value',
    onChartClick
}) => {
    const total = data.reduce((acc, curr) => acc + curr[dataKey], 0);

    const renderSlice = (entry, idx) => (
        <Cell
            key={`${entry}-${idx}`}
            fill={CHART_COLORS[idx % CHART_COLORS.length]}
            onClick={onChartClick}
        />
    );

    const CustomTooltip = ({payload}) => {
        if (payload && payload.length) {
            const {name, value} = payload[0];
            return <div className="tooltip-container">{`${name}: ${value}, ${((value / total) * 100).toFixed(0)}%`}</div>;
        }
        return '';
    };

    const renderChart = () => (
        <ResponsiveContainer width="100%" height={400}>
            <PieChart data={data} height={500}>
                <Pie
                    data={data}
                    dataKey={dataKey}
                    innerRadius={64}
                    outerRadius={120}
                    fill="#82ca9d"
                    cy={136}
                >
                    {data.map(renderSlice)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend layout="vertical" />
            </PieChart>
        </ResponsiveContainer>
    );

    return (
        <div className="pie-wrapper">
            {title && <h3>{title}</h3>}
            {data && data.length
                ? renderChart()
                : <NoResults />}
        </div>
    );
};

export default PieChartWrapper;
