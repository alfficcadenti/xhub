import React, {PureComponent, Fragment} from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export default class TotalChart extends PureComponent {
    brandColor = (brand) => {
        switch (brand) {
            case 'BEX':
                return '#1B5CAF';
            case 'Vrbo':
                return '#1478F7';
            case 'Hotels.com':
                return '#F71414';
            default:
                return '#1B5CAF';
        }
    }

    renderGradient = (brand) => {
        const brandColor = this.brandColor(brand);
        const id = `color${brand}`;
        return (
            <linearGradient key={`${brand}Gradient`} id={id} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={brandColor} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={brandColor} stopOpacity={0}/>
            </linearGradient>
        );
    }

    renderArea = (brand) => {
        const color = this.brandColor(brand);
        const fill = `url(#color${brand})`;
        return (
            <Area type="monotone" dataKey={brand} stroke={color} fillOpacity={1} fill={fill} />

        );
    }


    render() {
        const {brands} = this.props;
        return (
            <Fragment>
                <h3>{'Total bookings'}</h3>
                <ResponsiveContainer width="90%" height="80%">
                    <AreaChart width={730} height={250} data={this.props.data}
                        margin={{top: 10, right: 30, left: 0, bottom: 0}}
                    >
                        <defs>
                            {brands.map((brand) => this.renderGradient(brand))}
                        </defs>
                        <XAxis dataKey="time" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        {brands.map((brand) => this.renderArea(brand))}
                        <Legend onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} />
                    </AreaChart>
                </ResponsiveContainer>
            </Fragment>
        );
    }
}
