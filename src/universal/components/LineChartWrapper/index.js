import React, {useState} from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceArea
} from 'recharts';
import HelpText from '../../components/HelpText/HelpText';
import {CHART_COLORS} from '../../constants';
import './styles.less';


const LineChartWrapper = ({
    title,
    helpText,
    data = [],
    keys = [],
    onDotClick,
    enableLineHiding = false,
    refAreaLeft,
    refAreaRight,
    onMouseDown = () => {},
    onMouseMove = () => {},
    onMouseUp = () => {},
    showDot = true,
    height = 300,
    width = '100%',
    connectNulls = false,
    allowDecimals = false,
    minChartValue = 'auto',
    maxChartValue = 'auto'
}) => {
    const [hiddenKeys, setHiddenKeys] = useState([]);

    const yAxisId = `${title}-yAxis`;
    const allowEscapeViewBox = {'x': true, 'y': true};

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
                onClick: onDotClick || (() => {})
            }}
            hide={hiddenKeys.includes(line)}
            yAxisId={yAxisId}
            dot={showDot}
            connectNulls={connectNulls}
        />
    );

    const renderTitle = () => (
        <h3>
            {title}
            {helpText && <HelpText className="help-text" text={helpText} placement="bottom" />}
        </h3>
    );

    const renderReferenceArea = () => (
        keys.refAreaLeft && refAreaRight && <ReferenceArea yAxisId={yAxisId} x1={refAreaLeft} x2={refAreaRight} strokeOpacity={0.3} />
    );

    const renderLineChart = (isResponsive) => (
        <LineChart
            width={isResponsive ? Number('') : width}
            height={isResponsive ? Number('') : height}
            data={data}
            margin={{top: 5, right: 30, left: 20, bottom: 5}}
            cursor={onDotClick ? 'pointer' : ''}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId={yAxisId} allowDecimals={allowDecimals} type="number" domain={[minChartValue, maxChartValue]}/>
            <Legend onClick={handleLegendClick} cursor={enableLineHiding ? 'pointer' : ''} />
            <Tooltip allowEscapeViewBox={allowEscapeViewBox} />
            {keys.map(renderLine)}
            {renderReferenceArea()}
        </LineChart>
    );

    const renderResponsiveLineChart = () => (
        <ResponsiveContainer width={width} height={height}>
            {renderLineChart(true)}
        </ResponsiveContainer>
    );

    return (
        <div className="line-chart-wrapper" title={title}>
            {title && renderTitle()}
            {`${width}`.includes('%') || `${height}`.includes('%')
                ? renderResponsiveLineChart()
                : renderLineChart()
            }
        </div>
    );
};

export default React.memo(LineChartWrapper);
