import React, {useState} from 'react';
import {
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ComposedChart, ReferenceArea, Area, ReferenceLine
} from 'recharts';
import moment from 'moment';

import {BRANDS_CHART, CHART_COLORS} from '../../../../constants';
import {startTime, endTime, getColor, getDefaultTimeInterval, getTimeIntervals, isValidTimeInterval} from '../../../../impulseHandler';
import AnomalyLabel from '../BookingChart/AnomalyLabel';

const BookingChartByBrand = ({data = [], setStartDateTime, setEndDateTime, setChartSliced, daysDifference, setDaysDifference, setTableData, anomalies, setAnomalyTableData, timeInterval, setTimeInterval, setTimeIntervalOpts}) => {
    const [left, setLeft] = useState('dataMin');
    const [right, setRight] = useState('dataMax');
    const [refAreaLeft, setRefAreaLeft] = useState('');
    const [refAreaRight, setRefAreaRight] = useState('');

    const [hiddenKeys, setHiddenKeys] = useState([]);

    const formatDateTimeLocal = (date) => moment(date).format('MM/DD HH:mm');

    const CustomTooltip = ({active, payload}) => {
        const TIMEZONE = moment().tz(moment.tz.guess()).format('z');
        if (active && payload?.[0]?.payload) {
            return (<div className="custom-tooltip">
                <span className="label">{`${formatDateTimeLocal(payload[0].payload.time)} ${TIMEZONE}`}</span>
                {payload.map((item) => (
                    <div>
                        <span className="label">{`${item.dataKey} : ${item.value}`} </span>
                    </div>
                ))}
            </div>);
        }
        return null;
    };

    const renderChart = (name, idx) => {
        const fill = `url(#${idx})`;
        return data.length && data[0].hasOwnProperty(name) ? <Area type="monotone" dataKey={name} yAxisId={1} stroke={CHART_COLORS[idx]} fillOpacity={1} fill={fill} hide = {hiddenKeys.includes(name)}/>
            : '';
    };

    const resetGraphToDefault = () => {
        setStartDateTime(startTime());
        setEndDateTime(endTime());
        setChartSliced(false);
        setDaysDifference(3);
        if (!isValidTimeInterval(startTime(), endTime(), timeInterval)) {
            setTimeInterval('5m');
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
        setDaysDifference(rightMomentUtc.diff(leftMomentUtc, 'days'));
        setTableData([]);
        if (!isValidTimeInterval(leftMomentUtc, rightMomentUtc, timeInterval)) {
            const newInterval = getDefaultTimeInterval(leftMomentUtc, rightMomentUtc);
            setTimeInterval(newInterval);
            setTimeIntervalOpts(getTimeIntervals(leftMomentUtc, rightMomentUtc, newInterval));
        } else {
            setTimeIntervalOpts(getTimeIntervals(leftMomentUtc, rightMomentUtc, timeInterval));
        }
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

    const getGradient = (name, idx) => {
        return (
            <linearGradient id={idx} key={idx} x1="0" y1="0" x2="0" y2="1">
                <stop offset="2%" stopColor={CHART_COLORS[idx]} stopOpacity={0.5}/>
                <stop offset="98%" stopColor={CHART_COLORS[idx]} stopOpacity={0}/>
            </linearGradient>
        );
    };

    return (
        <div className="bookings-container-box">
            <div className="reset-div"
                title={daysDifference === 3
                    ? 'Click to reset graph to default 3 day date time range (Disabled as Default Range Selected) '
                    : 'Click to reset graph to default 3 day date time range'}
            >
                <button
                    type="button"
                    className={'btn btn-default reset-btn'}
                    disabled={daysDifference === 3}
                    onClick={resetGraphToDefault}
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
                    <defs>
                        {BRANDS_CHART.map(getGradient)}
                    </defs>
                    {BRANDS_CHART.map(renderChart)}
                    <XAxis allowDataOverflow type="number" scale="time" dataKey="time" tick={{fontSize: 10}} tickFormatter={formatDateTimeLocal} domain={[left, right]}/>
                    <YAxis allowDataOverflow yAxisId={1} tick={{fontSize: 10}} type="number"/>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <Tooltip offset={15} content={CustomTooltip}/>
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

export default React.memo(BookingChartByBrand);