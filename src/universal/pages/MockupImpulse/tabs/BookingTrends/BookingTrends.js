import React, {PureComponent} from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import './styles.less';
import {IMPULSE_CHART_COLOR} from '../../../../constants';


class BookingTrends extends PureComponent {
    render() {
        const data = this.props;
        return (
            <div className="bookings-container-box">
                <h2 className="total-bookings-title">
                    {'Impulse'}
                </h2>
                <ResponsiveContainer width="100%" height="70%">
                    <AreaChart data={data.data} margin={{top: 10, right: 30, left: 0, bottom: 0}}
                    >
                        <defs>
                            <linearGradient id="colorBooking" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={IMPULSE_CHART_COLOR} stopOpacity={0.8}/>
                                <stop offset="95%" stopColor={IMPULSE_CHART_COLOR} stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="time" tick={{fontSize: 10}}/>
                        <YAxis tick={{fontSize: 10}}/>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <Tooltip/>
                        <Area type="monotone" dataKey="Booking Counts" stroke={IMPULSE_CHART_COLOR} fillOpacity={1} fill="url(#colorBooking)"/>
                        <Legend onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        );
    }
}

export default BookingTrends;
