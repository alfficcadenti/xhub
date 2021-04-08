import React, {useState} from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceArea
} from 'recharts';
import HelpText from '../../components/HelpText/HelpText';
import {CHART_COLORS} from '../../constants';
import './styles.less';

// eslint-disable-next-line complexity
const LineChartWrapper = ({
    title,
    helpText,
    data = [],
    keys = [],
    onDotClick,
    tooltipData,
    renderTooltipContent,
    enableLineHiding = false,
    refAreaLeft,
    refAreaRight,
    onMouseDown = () => {},
    onMouseMove = () => {},
    onMouseUp = () => {},
    showDot = true
}) => {
    const [selectedLine, setSelectedLine] = useState();
    const [hiddenKeys, setHiddenKeys] = useState([]);

    const yAxisId = `${title}-yAxis`;

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

    const handleLegendClick = (e) => {
        if (e && e.dataKey) {
            const nextHiddenKeys = [...hiddenKeys];
            const foundIdx = hiddenKeys.findIndex((h) => h === e.dataKey);
            if (foundIdx > -1) {
                nextHiddenKeys.splice(foundIdx, 1);
            } else {
                nextHiddenKeys.push(e.dataKey);
            }
            setHiddenKeys(nextHiddenKeys);
        }
    };

    const renderLine = (line, idx) => (
        <Line
            key={`line-${title}-${line}-${idx}`}
            type="monotone"
            dataKey={line}
            stroke={CHART_COLORS[idx]}
            activeDot={{
                onMouseOver: () => setSelectedLine(line),
                onClick: onDotClick || (() => {})
            }}
            hide={hiddenKeys.includes(line)}
            yAxisId={yAxisId}
            dot={showDot}
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
                <LineChart
                    data={data}
                    margin={{top: 5, right: 30, left: 20, bottom: 5}}
                    cursor={onDotClick ? 'pointer' : ''}
                    onMouseDown={onMouseDown}
                    onMouseMove={onMouseMove}
                    onMouseUp={onMouseUp}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId={yAxisId} allowDecimals={false} type="number" />
                    <Legend onClick={handleLegendClick} cursor={enableLineHiding ? 'pointer' : ''} />
                    {!tooltipData || !renderTooltipContent
                        ? <Tooltip />
                        : <Tooltip content={<CustomTooltip />} />
                    }
                    {keys.map(renderLine)}
                    {
                        (refAreaLeft && refAreaRight)
                            ? <ReferenceArea yAxisId={yAxisId} x1={refAreaLeft} x2={refAreaRight} strokeOpacity={0.3} />
                            : null
                    }
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default React.memo(LineChartWrapper);
