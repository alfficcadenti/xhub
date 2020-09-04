import React from 'react';
import {Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import './styles.less';
import moment from 'moment';

const BOOKING_CHART_COLOR = '#1478F7';
const PREDICTION_CHART_COLOR = '#c9405b';
const PREDICTION_COUNT = 'Prediction Counts';
const BOOKING_COUNT = 'Booking Counts';
const AreaChartType = 'Area';
const IMPULSE_CHART_TYPE = [
    {
        name: BOOKING_COUNT,
        color: BOOKING_CHART_COLOR,
        chartType: AreaChartType,
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

const BookingTrends = ({data = []}) => {
    const getGradient = ({key, color}) => {
        const id = key === 'bookingChart' ? `color${key}` : '';
        return (<linearGradient key={`${key}Gradient`} id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
            <stop offset="95%" stopColor={color} stopOpacity={0}/>
        </linearGradient>);
    };

    const renderChart = ({key, color, name}) => {
        const fill = `url(#color${key})`;
        return (<Area type="monotone" dataKey={name} stroke={color} fillOpacity={1} fill={fill}/>);
    };

    return (
        <div className="bookings-container-box">
            <div className="header-container">
                <h2 className="total-bookings-title">
                    {'Impulse'}
                </h2>
            </div>
            <ResponsiveContainer width="100%" height="70%">
                <AreaChart data={data} margin={{top: 10, right: 30, left: 0, bottom: 0}}>
                    <defs>
                        {IMPULSE_CHART_TYPE.map(getGradient)}
                    </defs>
                    <XAxis dataKey="time" tick={{fontSize: 10}} tickFormatter={formatDateTimeLocal}/>
                    <YAxis tick={{fontSize: 10}}/>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <Tooltip content={<CustomTooltip/>}/>
                    {IMPULSE_CHART_TYPE.map(renderChart)}
                    <Legend/>
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default React.memo(BookingTrends);
