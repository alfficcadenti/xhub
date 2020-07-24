import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import HelpText from '../../components/HelpText/HelpText';
import {CHART_COLORS} from '../../constants';
import './styles.less';

const LineChartWrapper = ({title, data = [], keys = [], tooltipData, renderTooltipContent, helpText}) => {
    let selectedLine;

    const CustomTooltip = ({label, active, payload}) => {
        if (!active || !selectedLine) {
            return null;
        }
        for (const line of payload) {
            if (line.dataKey === selectedLine) {
                return (
                    <div className="custom-tooltip-container">
                        <div className="dot-date">{label}</div>
                        <div className="dot-title">{line.name}</div>
                        {tooltipData[label][line.name].map(renderTooltipContent)}
                    </div>
                );
            }
        }
        return null;
    };

    const handleMouseOver = (line) => {
        selectedLine = line;
    };

    const renderLine = (line, idx) => (
        <Line
            key={`line-${title}-${line}`}
            type="monotone"
            dataKey={line}
            stroke={CHART_COLORS[idx]}
            activeDot={{onMouseOver: () => handleMouseOver(line)}}
        />
    );

    const renderTitle = () => (
        <h3>
            {title}
            {helpText && <HelpText className="help-text" text={helpText} placement="bottom" />}
        </h3>
    );

    return (
        <div className="line-chart-wrapper">
            {title && renderTitle()}
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Legend />
                    {!tooltipData || !renderTooltipContent
                        ? <Tooltip />
                        : <Tooltip content={<CustomTooltip />} />
                    }
                    {keys.map(renderLine)}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default React.memo(LineChartWrapper);
