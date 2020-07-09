import React, {PureComponent} from 'react';
import moment from 'moment';
import 'moment-timezone';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import HelpText from '../../../components/HelpText/HelpText';
import {BRANDS, getBrand} from '../../../constants';
import './styles.less';

const TIMEZONE_OFFSET = (new Date()).getTimezoneOffset();
const TIMEZONE_ABBR = moment.tz.zone(moment.tz.guess()).abbr(TIMEZONE_OFFSET);

export default class TotalChart extends PureComponent {
    renderGradient = (brand) => {
        const brandLabel = brand.replace(/\s/g, '');
        const {color} = getBrand(brand);
        const id = `color${brandLabel}`;
        return (
            <linearGradient key={`${brand}Gradient`} id={id} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
        );
    }

    renderArea = (brand) => {
        const brandLabel = brand.replace(/\s/g, '');
        const color = getBrand(brand).color;
        const fill = `url(#color${brandLabel})`;
        return (
            <Area type="monotone" dataKey={brand} stroke={color} fillOpacity={1} fill={fill} key={`area${brand}`}/>
        );
    };


    render() {
        const {brands, data} = this.props;
        const allBrands = BRANDS.map((brand) => brand.landingBrand).filter((brand) => !!brand);
        const selectedBrands = brands.includes('Expedia Group') ? allBrands : brands;
        return (
            <div className="total-bookings-container">
                <h2 className="total-bookings-title">
                    {'Total Bookings'}
                    <HelpText className="chart-info" text={`Total Bookings for the last 24 hours in ${TIMEZONE_ABBR} time. Data refreshes every minute.`} placement="bottom"/>
                </h2>
                <ResponsiveContainer width="100%" height="80%">
                    <AreaChart width={730} height={250} data={data}
                        margin={{top: 10, right: 30, left: 0, bottom: 0}}
                    >
                        <defs>
                            {selectedBrands.map((brand) => this.renderGradient(brand))}
                        </defs>
                        <XAxis dataKey="time" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        {selectedBrands.map((brand) => this.renderArea(brand))}
                        <Legend onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        );
    }
}
