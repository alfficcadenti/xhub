import React from 'react';
import {Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import './styles.less';

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
            <h2 className="total-bookings-title">
                {'Impulse'}
            </h2>
            <ResponsiveContainer width="100%" height="70%">
                <AreaChart data={data} margin={{top: 10, right: 30, left: 0, bottom: 0}}>
                    <defs>
                        {IMPULSE_CHART_TYPE.map((item) =>
                            getGradient(item)
                        )}
                    </defs>
                    <XAxis dataKey="time" tick={{fontSize: 10}}/>
                    <YAxis tick={{fontSize: 10}}/>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <Tooltip/>
                    {IMPULSE_CHART_TYPE.map((item) =>
                        renderChart(item)
                    )}
                    <Legend/>
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default React.memo(BookingTrends);
