import React, {useState} from 'react';
import {
    Area,
    AreaChart,
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
import ReferenceLabel from '../../../../components/ReferenceLabel';

const BOOKING_CHART_COLOR = '#1478F7';
const PREDICTION_CHART_COLOR = '#c9405b';
const PREDICTION_COUNT = 'Prediction Counts';
const BOOKING_COUNT = 'Booking Counts';
const IMPULSE_CHART_TYPE = [
    {
        name: BOOKING_COUNT,
        color: BOOKING_CHART_COLOR,
        key: 'bookingChart'
    },
    {
        name: PREDICTION_COUNT,
        color: PREDICTION_CHART_COLOR,
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
const BookingTrends = ({data = [], startDateTime, endDateTime, setStartDateTime, setEndDateTime, setChartSliced, annotations, defaultStartDate, defaultEndDate}) => {
    let [refAreaLeft, setRefAreaLeft] = useState('');
    let [refAreaRight, setRefAreaRight] = useState('');
    let [newData, setNewData] = useState(data);
    let [left, setLeft] = useState('dataMin');
    let [right, setRight] = useState('dataMax');
    let [daysDifference, setDaysDifference] = useState(moment(endDateTime).diff(moment(startDateTime), 'days'));
    const getGradient = ({key, color}) => {
        const id = `color${key}`;
        return (<linearGradient key={`${key}Gradient`} id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={key === 'bookingChart' ? 0.8 : 0.2}/>
            <stop offset="95%" stopColor={color} stopOpacity={0}/>
        </linearGradient>);
    };
    const resetGraphToDefault = () => {
        setStartDateTime(defaultStartDate);
        setEndDateTime(defaultEndDate);
        setChartSliced(true);
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
        setNewData(newData.slice());
        setLeft(nextRefAreaLeft);
        setRight(nextRefAreaRight);
        setStartDateTime(moment(nextRefAreaLeft).utc());
        setEndDateTime(moment(nextRefAreaRight).utc());
        setChartSliced(true);
    };
    const renderChart = ({key, color, name}) => {
        const fill = `url(#color${key})`;
        return (<Area
            type="monotone"
            dataKey={name}
            stroke={color}
            fillOpacity={1}
            fill={fill}
            yAxisId={1}
            key={`area${name}`}
            animationDuration={300}
        />);
    };
    return (
        <div className="bookings-container-box">
            <div className="reset-div">
                <button
                    type="button"
                    className={'btn btn-default reset-btn'}
                    disabled={daysDifference >= 3}
                    onClick={() => resetGraphToDefault()}
                >
                    {'Reset Graph'}
                </button>
            </div>
            <ResponsiveContainer width="100%" height="70%">
                <AreaChart
                    syncId="pageviews-widget"
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
                                label={<ReferenceLabel annotation={annotation} isImpulse/>}
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
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default React.memo(BookingTrends);
