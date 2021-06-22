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
import {endTime, getColor, startTime} from '../../../../impulseHandler';
import AnomalyLabel from '../BookingChart/AnomalyLabel';

const BookingChartByBrand = ({data = [], setStartDateTime, setEndDateTime, setChartSliced, daysDifference, setDaysDifference, setTableData, anomalies, setAnomalyTableData}) => {
    let [left, setLeft] = useState('dataMin');
    let [right, setRight] = useState('dataMax');
    let [refAreaLeft, setRefAreaLeft] = useState('');
    let [refAreaRight, setRefAreaRight] = useState('');

    const [hiddenKeys, setHiddenKeys] = useState([]);

    const formatDateTimeLocal = (date) => moment(date).format('MM/DD HH:mm');

    const CustomTooltip = ({active, payload}) => {
        const TIMEZONE = moment().tz(moment.tz.guess()).format('z');
        if (active && payload && payload[0] && payload[0].payload) {
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

        setRefAreaLeft('');
        setRefAreaRight('');
        setLeft(nextRefAreaLeft);
        setRight(nextRefAreaRight);
        setStartDateTime(moment(nextRefAreaLeft).utc());
        setEndDateTime(moment(nextRefAreaRight).utc());
        setChartSliced(true);
        setDaysDifference(moment(nextRefAreaRight).utc().diff(moment(nextRefAreaLeft).utc(), 'days'));
        setTableData([]);
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
            <div className="reset-div">
                <button
                    type="button"
                    className={'btn btn-default reset-btn'}
                    disabled={daysDifference === 3}
                    onClick={() => resetGraphToDefault()}
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
