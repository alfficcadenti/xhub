import React, {useRef} from 'react';
import moment from 'moment';
import {
    AreaChart,
    XAxis,
    YAxis,
    Area,
    ResponsiveContainer,
    CartesianGrid,
    ReferenceArea,
    ReferenceLine,
    Tooltip
} from 'recharts';
import {v1 as uuid} from 'uuid';
import HelpText from '../HelpText/HelpText';
import ReferenceLabel from '../ReferenceLabel';
import {getBrand} from '../../pages/utils';
import {getAnnotationStrokeColor} from '../utils.js';
import {EXPEDIA_BRAND, EXPEDIA_PARTNER_SERVICES_BRAND} from '../../constants';
import './styles.less';


const formatXAxis = (date) => moment(date).format('MM/DD HH:mm');

const renderHeader = (title, helpText) => (
    <h3>
        {title}
        {helpText && <HelpText text={helpText} />}
    </h3>
);

// eslint-disable-next-line complexity
const TravelerMetricsWidget = ({
    title = '',
    data = [],
    brand,
    tickGap = 5,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    chartLeft,
    chartRight,
    refAreaLeft,
    refAreaRight,
    helpText,
    annotations = [],
    formatYAxis = (value) => value,
    selectedLoBs = [],
    minChartValue = 'auto',
    maxChartValue = 'auto',
    ResponsiveContainerWidth = '100%',
    ResponsiveContainerHeight = '80%',
    stacked = false
}) => {
    const brandLabel = brand.replace(/\s/g, '');
    const fill = `url(#${brandLabel})`;
    const {color} = getBrand(brand, 'label');
    const yAxisId = `yAxis-${title}`;
    const emptyContainerMessage = 'There is no data available for this time period';

    const tooltipRef = useRef();
    const areaRef = useRef();
    const areaLOBRef = useRef();
    const pointRef = useRef();

    const doesChartHaveLoBs = (chartData, lobs) => {
        return lobs.length ? lobs.some((lob) => chartData.some((item) => !!item[lob.label])) : true;
    };

    const processChartData = (chartData, lobs) => {
        return chartData.map((item) => {
            const newEntry = {...item};

            lobs.forEach((lob) => {
                if (!newEntry[lob]) {
                    newEntry[lob] = 0;
                }
            });

            return newEntry;
        });
    };

    const updateTooltip = () => {
        const point = pointRef.current;
        const tooltip = tooltipRef.current;

        const getDeltaUserCount = () => {
            if (![EXPEDIA_BRAND, EXPEDIA_PARTNER_SERVICES_BRAND].includes(brand)) {
                return !selectedLoBs.length
                    ? `delta users = ${point.payload.deltaUserCount}`
                    : selectedLoBs
                        .map(({label}) => `<div class="lob-label">${label} delta users = ${point.payload[`${label}deltaUserCount`]}</div>`)
                        .join('');
            }
            return '';
        };

        if (point) {
            const x = Math.round(point.x);
            const y = Math.round(point.y - 140);

            tooltip.style.opacity = '1';
            tooltip.style.display = 'block';
            tooltip.style.transform = `translate(${x}px, ${y}px)`;
            tooltip.style.transition = 'transform 500ms linear';
            tooltip.style['will-change'] = 'transform';
            tooltip.childNodes[0].innerHTML = point.payload.label;
            tooltip.childNodes[1].innerHTML = !selectedLoBs.length
                ? `All LoBs = ${point.payload.value}`
                : selectedLoBs
                    .map(({label}) => `<div class="lob-label">${label} = ${point.payload[label]}</div>`)
                    .join('');
            tooltip.childNodes[2].innerHTML = getDeltaUserCount();
        } else {
            tooltip.style.opacity = '0';
            tooltip.style.display = 'none';
        }
    };

    const onChartMouseMove = (chart) => {
        onMouseMove(chart);

        if (chart.isTooltipActive) {
            const area = selectedLoBs.length ? areaLOBRef.current : areaRef.current;
            const point = {...area.props.points[chart.activeTooltipIndex]};
            const isTooltipBeyondChart = (chart.chartX + 135) > area.props.width;

            if (isTooltipBeyondChart) {
                const tooltipWidth = 200;
                point.x = point.x - tooltipWidth;
            }

            if (point !== pointRef.current) {
                pointRef.current = point;
                updateTooltip();
            }
        }
    };

    const onChartMouseLeave = () => {
        pointRef.current = null;
        updateTooltip();
    };

    const renderCustomTooltip = () => (
        <div className="custom-tooltip" ref={tooltipRef}>
            <p className="label" />
            <div className="label" />
            <div className="label" />
        </div>
    );

    const renderAnnotations = () => {
        return annotations && annotations.map((annotation) => (
            <ReferenceLine
                key={uuid()}
                yAxisId={yAxisId}
                x={Number.isNaN(annotation.time) ? 0 : annotation.time}
                label={<ReferenceLabel annotation={annotation} />}
                stroke={getAnnotationStrokeColor(annotation.category)}
                strokeDasharray="3 3"
                isFront
            />
        ));
    };

    const renderLoBArea = () => {
        return selectedLoBs.map((lob, i) => (
            <Area
                ref={areaLOBRef}
                connectNulls
                stacked={!stacked || i}
                type="monotone"
                dataKey={lob.label}
                stroke={color}
                fillOpacity={1}
                fill={fill}
                key={`area${lob.label}`}
                yAxisId={yAxisId}
            />
        ));
    };

    const renderCharts = () => (
        (<>
            <ResponsiveContainer width={ResponsiveContainerWidth} height={ResponsiveContainerHeight}>
                <AreaChart
                    width={100}
                    height={100}
                    data={processChartData(data, selectedLoBs.map((item) => item.label))}
                    onMouseDown={onMouseDown}
                    onMouseUp={onMouseUp}
                    cursor="crosshair"
                    onMouseMove={onChartMouseMove}
                    onMouseLeave={onChartMouseLeave}
                    margin={{top: 0, right: 5, bottom: 5, left: 5}}
                >
                    <defs>
                        <linearGradient key={`${title}Gradient`} id={brandLabel} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                            <stop offset="95%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis
                        allowDataOverflow
                        dataKey="time"
                        type="number"
                        scale="time"
                        minTickGap={tickGap}
                        tickFormatter={formatXAxis}
                        domain={[chartLeft, chartRight]}
                        tick={{fontSize: 10}}
                    />
                    <YAxis
                        allowDataOverflow
                        type="number"
                        yAxisId={yAxisId}
                        tick={{fontSize: 10}}
                        tickFormatter={formatYAxis}
                        domain={[minChartValue, maxChartValue]}
                    />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip cursor={false} wrapperStyle={{display: 'none'}} />
                    {selectedLoBs && selectedLoBs.length
                        ? renderLoBArea()
                        :
                        <Area
                            ref={areaRef}
                            connectNulls
                            type="monotone"
                            dataKey="value"
                            name="All LoBs"
                            stroke={color}
                            fillOpacity={1}
                            fill={fill}
                            key={`area${brand}`}
                            yAxisId={yAxisId}
                        />
                    }
                    {renderAnnotations()}
                    {
                        (refAreaLeft && refAreaRight)
                            ? <ReferenceArea yAxisId={yAxisId} x1={refAreaLeft} x2={refAreaRight} strokeOpacity={0.3} />
                            : null
                    }
                </AreaChart>
            </ResponsiveContainer>
            {renderCustomTooltip()}
        </>)
    );

    return (
        <div className="widget-card card" key={title}>
            {renderHeader(title, helpText)}
            {
                data.length && doesChartHaveLoBs(data, selectedLoBs)
                    ? renderCharts()
                    : <div className="recharts-empty-container">{emptyContainerMessage}</div>
            }
        </div>
    );
};

export default TravelerMetricsWidget;
