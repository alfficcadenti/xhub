import React, {useEffect, useState} from 'react';
import {
    Area,
    Bar,
    ComposedChart,
    AreaChart,
    Line,
    CartesianGrid,
    Legend,
    ReferenceArea, ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import './styles.less';
import moment from 'moment';
import ReferenceLabel from '../../../../../../components/ReferenceLabel';
import {
    startTime,
    endTime,
    getColor,
    isValidTimeInterval,
    getDefaultTimeInterval,
    getTimeIntervals
} from '../../../../impulseHandler';
import AnomalyLabel from './AnomalyLabel';
import {
    ANOMALY_DETECTED_COLOR,
    ANOMALY_RECOVERED_COLOR,
    INCIDENT_TOOLTIP_COLOR,
    UPSTREAM_UNHEALTHY_COLOR
} from '../../../../../../constants';
import {getResetGraphTitle} from '../../../../../utils';

const BOOKING_CHART_COLOR = '#336BFF';
const THREE_WEEK_AVG_COUNT_COLOR = '#34495E';
const THREE_WEEK_AVG_COUNT = '3 Week Avg Counts';
const PREDICTION_COUNT = 'Prediction Counts';
const YOY_COUNT = 'YOY Counts';
const BOOKING_COUNT = 'Booking Counts';
const INCIDENT = 'Incident';
const ANOMALY_DETECTED = 'Detected';
const ANOMALY_RECOVERED = 'Recovered';
const UPSTREAM_UNHEALTHY = 'Upstream Unhealthy';
const AreaChartType = 'Area';
const BarChartType = 'Bar';

const IMPULSE_CHART_TYPE = [
    {
        name: BOOKING_COUNT,
        color: BOOKING_CHART_COLOR,
        chartType: BarChartType,
        key: 'bookingChart'
    },
    {
        name: THREE_WEEK_AVG_COUNT,
        color: THREE_WEEK_AVG_COUNT_COLOR,
        chartType: AreaChartType,
        key: 'predictionChart'
    }
];

const LEGEND_TYPE2 = [
    {
        value: INCIDENT,
        type: 'triangle',
        color: INCIDENT_TOOLTIP_COLOR,
    },
    {
        value: ANOMALY_DETECTED,
        type: 'circle',
        color: ANOMALY_DETECTED_COLOR
    },
    {
        value: ANOMALY_RECOVERED,
        type: 'circle',
        color: ANOMALY_RECOVERED_COLOR
    },
    {
        value: UPSTREAM_UNHEALTHY,
        type: 'circle',
        color: UPSTREAM_UNHEALTHY_COLOR
    }
];

const formatDateTimeLocal = (date) => moment(date).format('MM/DD HH:mm');

const CustomTooltip = ({active, payload}) => {
    const TIMEZONE = moment().tz(moment.tz.guess()).format('z');
    if (active && payload && payload[0] && payload[0].payload) {
        return (<div className="custom-tooltip">
            <span className="label">{`${formatDateTimeLocal(payload[0].payload.time)} ${TIMEZONE}`}</span>
            {payload.map((item) => (
                <div>
                    <span className="label">{`${item.dataKey} : ${item.value}`}</span>
                </div>
            ))}
        </div>);
    }
    return null;
};

const BookingChart = ({
    data = [],
    setStartDateTime,
    setEndDateTime,
    setChartSliced,
    setIsResetClicked,
    annotations,
    daysDifference,
    setDaysDifference,
    setTableData,
    anomalies,
    setAnomalyTableData,
    timeInterval,
    setTimeInterval,
    setTimeIntervalOpts,
    setIsChartSliceClicked,
    setIsSubmitClicked,
    renderImage,
    imageContainer,
    hiddenKeys,
    setHiddenKeys
}) => {
    let [refAreaLeft, setRefAreaLeft] = useState('');
    let [refAreaRight, setRefAreaRight] = useState('');
    let [newData, setNewData] = useState(data);
    let [left, setLeft] = useState('dataMin');
    let [right, setRight] = useState('dataMax');

    const getGradient = ({key, color}) => {
        const id = `color${key}`;
        return (<linearGradient key={`${key}Gradient`} id={id} x1="0" y1="0" x2="0" y2="1" spreadMethod="reflect">
            <stop offset="5%" stopColor={color} stopOpacity={key === 'bookingChart' ? 0.8 : 0.2}/>
            <stop offset="95%" stopColor={color} stopOpacity={key === 'bookingChart' ? 0.4 : 0}/>
        </linearGradient>);
    };
    const resetGraphToDefault = () => {
        setStartDateTime(startTime());
        setEndDateTime(endTime());
        setChartSliced(false);
        setDaysDifference(3);
        setIsResetClicked(true);
        setIsSubmitClicked(false);
        setTimeInterval('5m');
        if (!isValidTimeInterval(startTime(), endTime(), timeInterval)) {
            setTimeIntervalOpts(['15m', '30m', '1h']);
        } else {
            setTimeIntervalOpts(getTimeIntervals(startTime(), endTime(), timeInterval));
        }
    };
    useEffect(() => {
        setNewData(data);
    }, [data]);
    const zoomIn = () => {
        if (refAreaLeft === refAreaRight || refAreaRight === '') {
            setRefAreaLeft('');
            setRefAreaRight('');
            return;
        }
        let nextRefAreaLeft = refAreaLeft;
        let nextRefAreaRight = refAreaRight;

        if (moment(refAreaLeft).isAfter(refAreaRight)) {
            [nextRefAreaLeft, nextRefAreaRight] = [refAreaRight, refAreaLeft];
        }
        const leftMomentUtc = moment(nextRefAreaLeft).utc();
        const rightMomentUtc = moment(nextRefAreaRight).utc();
        setRefAreaLeft('');
        setRefAreaRight('');
        setNewData(newData.slice());
        setLeft(nextRefAreaLeft);
        setRight(nextRefAreaRight);
        setStartDateTime(leftMomentUtc);
        setEndDateTime(rightMomentUtc);
        setChartSliced(true);
        setIsChartSliceClicked(true);
        setDaysDifference(rightMomentUtc.diff(leftMomentUtc, 'days'));
        setTableData([]);
        setIsSubmitClicked(false);
        if (!isValidTimeInterval(leftMomentUtc, rightMomentUtc, timeInterval)) {
            const newInterval = getDefaultTimeInterval(leftMomentUtc, rightMomentUtc);
            setTimeInterval(newInterval);
            setTimeIntervalOpts(getTimeIntervals(leftMomentUtc, rightMomentUtc, newInterval));
        } else {
            setTimeIntervalOpts(getTimeIntervals(leftMomentUtc, rightMomentUtc, timeInterval));
        }
    };
    const renderChart = ({key, color, name, chartType}) => {
        const fill = `url(#color${key})`;
        return chartType === 'Area'
            ? (
                <Area
                    type="monotone"
                    dataKey={name}
                    stroke={color}
                    fillOpacity={1}
                    fill={fill}
                    yAxisId={1}
                    key={`area${name}`}
                    animationDuration={300}
                    hide = {hiddenKeys.includes(name)}
                />
            )
            : <Bar dataKey={name} fillOpacity={1} yAxisId={1} key={`bar${name}`} fill={fill} animationDuration={300} hide = {hiddenKeys.includes(name)}/>;
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

    return (
        <div className="bookings-container-box" ref={imageContainer}>
            <div className="download-reset-container" data-html2canvas-ignore>
                {renderImage()}
                <button
                    type="button"
                    title={getResetGraphTitle(daysDifference)}
                    className={'btn btn-default reset-btn'}
                    disabled={daysDifference === 3}
                    onClick={() => resetGraphToDefault()}
                >
                    {'Reset Graph'}
                </button>
            </div>
            <ResponsiveContainer width="100%" height="70%">
                <ComposedChart
                    data={newData}
                    margin={{top: 10, right: 30, left: 0, bottom: 0}}
                    onMouseDown={(e) => e && setRefAreaLeft(e.activeLabel)}
                    onMouseMove={(e) => refAreaLeft && setRefAreaRight(e.activeLabel)}
                    onMouseUp={zoomIn}
                    cursor="crosshair"
                >
                    <defs>
                        {IMPULSE_CHART_TYPE.map(getGradient)}
                    </defs>
                    <XAxis allowDataOverflow type="number" scale="time" dataKey="time" tick={{fontSize: 10}} tickFormatter={formatDateTimeLocal} domain={[left, right]}/>
                    <YAxis allowDataOverflow yAxisId={1} tick={{fontSize: 10}} type="number"/>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <Tooltip content={<CustomTooltip/>}/>
                    {IMPULSE_CHART_TYPE.map(renderChart)}
                    { data.length && data[0].hasOwnProperty(YOY_COUNT) ? <Line type="monotone" dataKey={YOY_COUNT} stroke="#3CB371" yAxisId={1} strokeWidth={1.5} dot={false} animationDuration={300} hide = {hiddenKeys.includes(YOY_COUNT)}/> : ''}
                    { data.length && data[0].hasOwnProperty(PREDICTION_COUNT) ? <Line type="monotone" dataKey={PREDICTION_COUNT} stroke="#c9405b" yAxisId={1} strokeWidth={1.5} dot={false} animationDuration={300} hide = {hiddenKeys.includes(PREDICTION_COUNT)}/> : ''}
                    {
                        anomalies && anomalies.map((anomaly) => (
                            <ReferenceLine
                                key={Math.random()}
                                yAxisId={1}
                                x={anomaly.time}
                                label={<AnomalyLabel anomaly={anomaly} setAnomalyTableData={setAnomalyTableData} category={anomaly.category}/>}
                                stroke={getColor(anomaly)}
                                strokeDasharray="3 3"
                            />
                        ))
                    }
                    {
                        annotations && annotations.map((annotation) => (
                            <ReferenceLine
                                key={Math.random()}
                                yAxisId={1}
                                x={annotation.incidentTime}
                                label={<ReferenceLabel annotation={annotation} isImpulse setTableData={setTableData}/>}
                                stroke={'red'}
                                strokeDasharray="3 3"
                                isFront
                            />
                        ))
                    }
                    {
                        (refAreaLeft && refAreaRight)
                            ? <ReferenceArea yAxisId={1} x1={refAreaLeft} x2={refAreaRight} strokeOpacity={0.3}/>
                            : null
                    }
                    <Legend onClick={handleLegendClick}/>
                </ComposedChart>
            </ResponsiveContainer>
            <ResponsiveContainer id="extra-legends" width="100%" height="8%">
                <AreaChart>
                    <Legend payload={LEGEND_TYPE2} iconSize={10}/>
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default React.memo(BookingChart);
