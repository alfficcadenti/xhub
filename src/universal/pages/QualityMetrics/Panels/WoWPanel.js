import React, {useState, useEffect} from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import Panel from '../Panel';
import {CHART_COLORS} from '../../../constants';
import {formatWoWData} from '../utils';

const WoWPanel = ({tickets, dataUrl}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [chartData, setChartData] = useState([]);

    const title = 'Created WoW and Resolved WoW';

    useEffect(() => {
        const fetchData = () => {
            setIsLoading(true);
            setError(null);
            fetch(dataUrl)
                .then((data) => data.json())
                .then((response) => {
                    const rawData = response.data.wowIssues;
                    const data = rawData.info && rawData.info.message === 'no data found'
                        ? []
                        : formatWoWData(rawData);
                    setChartData(data);
                    setIsLoading(false);
                })
                .catch((e) => {
                    setChartData([]);
                    setError(e.message);
                    setIsLoading(false);
                });
        };
        fetchData();
    }, [tickets, dataUrl]);

    return (
        <Panel
            title={title}
            isLoading={isLoading}
            error={error}
            isFullWidth
        >
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line dataKey="created" stroke={CHART_COLORS[0]} />
                    <Line dataKey="resolved" stroke={CHART_COLORS[2]} />
                    <Line dataKey="diff" stroke={CHART_COLORS[3]} />
                </LineChart>
            </ResponsiveContainer>
        </Panel>
    );
};

export default WoWPanel;
