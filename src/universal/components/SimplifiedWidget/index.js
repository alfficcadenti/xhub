import React from 'react';
// import Trend from 'react-trend';
import {LineChart, Line, Tooltip, ResponsiveContainer} from 'recharts';
import './styles.less';

// eslint-disable-next-line complexity
const CustomTooltip = ({active, payload}) => {
    if (active && payload[0] && payload[0].payload && payload[0].payload.label && payload[0].value) {
        return (
            <div className="custom-tooltip">
                <p className="label">{`${payload[0].payload.label} : ${payload[0].value}`}</p>
            </div>
        );
    }
    return null;
};

const SimplifiedWidget = ({title = '', data = []}) => {
    const lastValue = data.slice(-1)[0] && data.slice(-1)[0].value || 0;
    return (
        <div className="widget-card card" key={title}>
            <h3>{title}</h3>
            <div className="last-value">{lastValue}</div>
            {
                data.length ?
                    <ResponsiveContainer width="100%" height="80%">
                        <LineChart width={100} height={100} data={data}>
                            <Line type="monotone" dataKey="value" stroke="#1B5CAF" strokeWidth={2} />
                            <Tooltip content={<CustomTooltip />} />
                        </LineChart>
                    </ResponsiveContainer> :
                    <div className="recharts-empty-container" />
            }
        </div>
    );
};

export default SimplifiedWidget;