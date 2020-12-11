import React, {useEffect, useState} from 'react';
import {
    Area,
    Bar,
    ComposedChart,
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
import {startTime, endTime} from '../../../../impulseHandler';

const BOOKING_CHART_COLOR = '#336BFF';
const PREDICTION_CHART_COLOR = '#c9405b';
const PREDICTION_COUNT = 'Prediction Counts';
const BOOKING_COUNT = 'Booking Counts';
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
        name: PREDICTION_COUNT,
        color: PREDICTION_CHART_COLOR,
        chartType: AreaChartType,
        key: 'predictionChart'
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
const BookingChart = ({data = [], setStartDateTime, setEndDateTime, setChartSliced, annotations, daysDifference, setDaysDifference, setTableData}) => {
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
        setRefAreaLeft('');
        setRefAreaRight('');
        setNewData(newData.slice());
        setLeft(nextRefAreaLeft);
        setRight(nextRefAreaRight);
        setStartDateTime(moment(nextRefAreaLeft).utc());
        setEndDateTime(moment(nextRefAreaRight).utc());
        setChartSliced(true);
        setDaysDifference(moment(nextRefAreaRight).utc().diff(moment(nextRefAreaLeft).utc(), 'days'));
        setTableData([]);
    };
    const renderChart = ({key, color, name, chartType}) => {
        const fill = `url(#color${key})`;
        return chartType === 'Area' ? <Area
            type="monotone"
            dataKey={name}
            stroke={color}
            fillOpacity={1}
            fill={fill}
            yAxisId={1}
            key={`area${name}`}
            animationDuration={300}
        /> : <Bar dataKey={name} fillOpacity={1} yAxisId={1} key={`bar${name}`} fill={fill} animationDuration={300}/>;
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
                    <Legend/>
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
};

export default React.memo(BookingChart);
