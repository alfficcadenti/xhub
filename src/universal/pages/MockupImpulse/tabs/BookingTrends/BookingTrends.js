import React, {PureComponent} from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import './styles.less';
import {IMPULSE_CHART_TYPE} from '../../../../constants';


class BookingTrends extends PureComponent {
    getGradient = (item) => {
        const type = item.key;
        // const id = `color${type}`;
        const id = type === 'bookingChart' ? `color${type}` : '';

        return (<linearGradient key={`${type}Gradient`} id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={item.color} stopOpacity={0.8}/>
            <stop offset="95%" stopColor={item.color} stopOpacity={0}/>
        </linearGradient>);
    };
    renderChart = (item) => {
        const type = item.key;

        const fill = `url(#color${type})`;

        return (<Area type="monotone" dataKey={item.name} stroke={item.color} fillOpacity={1} fill={fill}/>);
    }

    render() {
        const data = this.props;
        return (
            <div className="bookings-container-box">
                <h2 className="total-bookings-title">
                    {'Impulse'}
                </h2>
                <ResponsiveContainer width="100%" height="70%">
                    <AreaChart data={data.data} margin={{top: 10, right: 30, left: 0, bottom: 0}}>
                        <defs>
                            {IMPULSE_CHART_TYPE.map((item) =>
                                this.getGradient(item)
                            )}
                        </defs>
                        <XAxis dataKey="time" tick={{fontSize: 10}}/>
                        <YAxis tick={{fontSize: 10}}/>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <Tooltip/>

                        {IMPULSE_CHART_TYPE.map((item) =>
                            this.renderChart(item)
                        )}
                        <Legend onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}/>
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        );
    }
}

export default BookingTrends;
