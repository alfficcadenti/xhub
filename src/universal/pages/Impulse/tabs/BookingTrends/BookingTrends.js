import React, {useState} from 'react';
import {Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import './styles.less';
import moment from 'moment';
import momentTz from 'moment-timezone';
import {RadioButton, RadioGroup} from '@homeaway/react-form-components';
const TIMEZONE = moment().tz(moment.tz.guess()).format('z');

const PST = 'pst';
const UTC = 'utc';
const LOCAL = 'local';
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

const formatDateTimeUTC = (date) => moment(date).utc().format('MM/DD HH:mm');
const formatDateTimeLocal = (date) => moment(date).format('MM/DD HH:mm');
const formatDateTimePST = (date) => momentTz(date).tz('America/Los_Angeles').format('MM/DD HH:mm');

const formatTooltip = (date, choice) => {
    if (choice === PST) {
        return `${formatDateTimePST(date)} PST`;
    } else if (choice === UTC) {
        return `${formatDateTimeUTC(date)} UTC`;
    }
    return `${formatDateTimeLocal(date)} ${TIMEZONE}`;
};
const CustomTooltip = ({active, payload, choice = PST}) => {
    if (active && payload && payload[0] && payload[0].payload) {
        return (<div className="custom-tooltip">
            <span
                className="label"
            >{formatTooltip(payload[0].payload.time, choice)}</span>
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
    let [choice, setChoice] = useState(PST);

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
    const handleChoiceChange = (value) => {
        setChoice(value);
    };
    const renderXAxis = (date) => {
        if (choice === PST) {
            return formatDateTimePST(date);
        } else if (choice === UTC) {
            return formatDateTimeUTC(date);
        }
        return formatDateTimeLocal(date);
    };
    return (
        <div className="bookings-container-box">
            <div className="header-container">
                <h2 className="total-bookings-title">
                    {'Impulse'}
                </h2>
                <div className="radio-group-style">
                    <RadioGroup name="timezone" ariaLabel="timezone selection">
                        <RadioButton
                            label="PST"
                            value="pst"
                            checked={choice === PST}
                            onChange={() => handleChoiceChange(PST)}
                            inline
                            size="sm"
                            className="radio-buttons"
                        />
                        <RadioButton
                            label="UTC"
                            value="utc"
                            checked={choice === UTC}
                            onChange={() => handleChoiceChange(UTC)}
                            inline
                            size="sm"
                            className="radio-buttons"
                        />
                        <RadioButton
                            label="Local"
                            value="local"
                            checked={choice === LOCAL}
                            onChange={() => handleChoiceChange(LOCAL)}
                            inline
                            size="sm"
                            className="radio-buttons"
                        />
                    </RadioGroup>
                </div>
            </div>
            <ResponsiveContainer width="100%" height="70%">
                <AreaChart data={data} margin={{top: 10, right: 30, left: 0, bottom: 0}}>
                    <defs>
                        {IMPULSE_CHART_TYPE.map((item) =>
                            getGradient(item)
                        )}
                    </defs>
                    <XAxis dataKey="time" tick={{fontSize: 10}} tickFormatter={renderXAxis}/>
                    <YAxis tick={{fontSize: 10}}/>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <Tooltip content={<CustomTooltip choice={choice}/>}/>
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
