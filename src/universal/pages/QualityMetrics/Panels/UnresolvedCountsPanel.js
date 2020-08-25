import React, {useState, useEffect} from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import Panel from '../Panel';
import {CHART_COLORS} from '../../../constants';

const UnresolvedCountsPanel = ({title, info, tickets, data, isLoading, error, dataKey}) => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const formattedData = Object.values(data[dataKey] || {})
            .map(({weekStartDate, numberOfUnResolvedIssues}) => ({
                date: weekStartDate,
                counts: numberOfUnResolvedIssues
            }));
        setChartData(formattedData);
    }, [tickets, data, dataKey]);

    return (
        <Panel
            title={title}
            info={info}
            isLoading={isLoading}
            error={error}
            info="The weekly average amount of days between a ticket's create date and resolve date w.r.t. priority"
        >
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line dataKey="counts" stroke={CHART_COLORS[0]} />
                </LineChart>
            </ResponsiveContainer>
        </Panel>
    );
};

export default UnresolvedCountsPanel;
