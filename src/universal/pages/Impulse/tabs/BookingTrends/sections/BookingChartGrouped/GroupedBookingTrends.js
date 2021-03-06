import React, {useState} from 'react';
import {
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ComposedChart, ReferenceArea, Area, ReferenceLine, Line
} from 'recharts';
import moment from 'moment';

import {BRANDS_CHART, CHART_COLORS, LOBS_CHART, DEVICE_CHART, REGION_CHART} from '../../../../constants';
import {startTime, endTime, getColor, getDefaultTimeInterval, getTimeIntervals, isValidTimeInterval} from '../../../../impulseHandler';
import AnomalyLabel from '../BookingChart/AnomalyLabel';
import ReferenceLabel from '../../../../../../components/ReferenceLabel';
import '../../../../../../pages/Impulse/tabs/BookingTrends/sections/BookingChart/styles.less';
import {getResetGraphTitle} from '../../../../../utils';

const GroupedBookingTrends = ({
    data = [],
    setStartDateTime,
    setEndDateTime,
    setChartSliced,
    daysDifference,
    setDaysDifference,
    annotations,
    setTableData,
    anomalies,
    setAnomalyTableData,
    timeInterval,
    setTimeInterval,
    setTimeIntervalOpts,
    activeIndex,
    setIsResetClicked,
    setIsChartSliceClicked,
    setIsSubmitClicked,
    renderImage,
    imageContainer,
    hiddenKeys,
    setHiddenKeys
}) => {
    const [left, setLeft] = useState('dataMin');
    const [right, setRight] = useState('dataMax');
    const [refAreaLeft, setRefAreaLeft] = useState('');
    const [refAreaRight, setRefAreaRight] = useState('');

    const [highlightedKey, setHighlightedKey] = useState('');

    const POS_CHART = data.length > 0 ? Object.getOwnPropertyNames(data[0]).slice(1) : [];

    const INDEX_CHART_MAP = [[], BRANDS_CHART, LOBS_CHART, POS_CHART, DEVICE_CHART, REGION_CHART];

    const formatDateTimeLocal = (date) => moment(date).format('MM/DD HH:mm');

    const CustomTooltip = ({active, payload}) => {
        const TIMEZONE = moment().tz(moment.tz.guess()).format('z');
        if (active && payload?.[0]?.payload) {
            return (<div className="custom-tooltip">
                <span className="label">{`${formatDateTimeLocal(payload[0].payload.time)} ${TIMEZONE}`}</span>
                {payload.map((item) => (
                    <div>
                        <span className="label" style={{color: item.dataKey === highlightedKey ? item.stroke : ''}}>{`${item.dataKey} : ${item.value}`} </span>
                    </div>
                ))}
            </div>);
        }
        return null;
    };

    const handleOnMouseEnter = (e) => {
        const {dataKey} = e;
        setHighlightedKey(dataKey);
    };

    const handleOnMouseLeave = () => {
        setHighlightedKey('');
    };

    const renderChart = ({name, color}, idx) => {
        const fill = `url(#${idx})`;
        return data?.[0]?.hasOwnProperty(name) ? <Area type="monotone" dataKey={name} yAxisId={1} stroke={color} fillOpacity={1} fill={fill} hide={hiddenKeys.includes(name)} onMouseEnter={handleOnMouseEnter} onMouseLeave={handleOnMouseLeave}/>
            : '';
    };

    const renderLineChart = (name, idx) => {
        return data?.[0]?.hasOwnProperty(name) ? <Line type="monotone" dataKey={name} stroke={CHART_COLORS[idx]} yAxisId={1} strokeWidth={1.5} dot={false} hide={hiddenKeys.includes(name)} onMouseEnter={handleOnMouseEnter} onMouseLeave={handleOnMouseLeave}/>
            : '';
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

    const handleLegendClick = (e) => {
        if (e?.dataKey) {
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

    const getGradient = ({color}, idx) => (
        <linearGradient id={idx} key={idx} x1="0" y1="0" x2="0" y2="1">
            <stop offset="2%" stopColor={color} stopOpacity={0.5}/>
            <stop offset="98%" stopColor={color} stopOpacity={0}/>
        </linearGradient>
    );

    const renderGradient = () => {
        const activeChart = INDEX_CHART_MAP[activeIndex];
        if (activeChart?.length) {
            return <defs>{activeChart.map(getGradient)}</defs>;
        }
        return '';
    };

    const renderMultiViewPanel = () => {
        if (activeIndex === 3) {
            return POS_CHART.map(renderLineChart);
        }
        const activeChart = INDEX_CHART_MAP[activeIndex];
        if (activeChart?.length) {
            return activeChart.map(renderChart);
        }
        return '';
    };

    return (
        <div className="bookings-container-box" ref={imageContainer}>
            <div className="download-reset-container" data-html2canvas-ignore>
                {renderImage()}
                <button
                    type="button"
                    className={'btn btn-default reset-btn'}
                    disabled={daysDifference === 3}
                    onClick={resetGraphToDefault}
                    title={getResetGraphTitle(daysDifference)}
                >
                    {'Reset Graph'}
                </button>
            </div>
            <ResponsiveContainer width="100%" height="70%">
                <ComposedChart
                    data={data}
                    margin={{top: 10, right: 30, left: 0, bottom: 0}}
                    onMouseDown={(e) => e && setRefAreaLeft(e.activeLabel)}
                    onMouseMove={(e) => refAreaLeft && setRefAreaRight(e.activeLabel)}
                    onMouseUp={zoomIn}
                    cursor="crosshair"
                >
                    {renderGradient()}
                    {renderMultiViewPanel()}
                    <XAxis allowDataOverflow type="number" scale="time" dataKey="time" tick={{fontSize: 10}} tickFormatter={formatDateTimeLocal} domain={[left, right]}/>
                    <YAxis allowDataOverflow yAxisId={1} tick={{fontSize: 10}} type="number"/>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <Tooltip offset={15} content={CustomTooltip}/>
                    {
                        anomalies?.map((anomaly) => (
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
                        annotations?.map((annotation) => (
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
        </div>
    );
};

export default React.memo(GroupedBookingTrends);
