import React, {PureComponent, Fragment} from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import HelpText from '../../../components/HelpText/HelpText';
import {BRANDS} from '../../../components/App/constants';

export default class TotalChart extends PureComponent {
    brandColor = (brand) => {
        switch (brand) {
            case 'BEX':
                return '#1B5CAF';
            case 'Vrbo':
                return '#1478F7';
            case 'Hotels.com':
                return '#F71414';
            case 'Expedia Business Services':
                return '#FFC72C';
            default:
                return '#1B5CAF';
        }
    }

    renderGradient = (brand) => {
        const brandLabel = brand.replace(/\s/g, '');
        const brandColor = this.brandColor(brand);
        const id = `color${brandLabel}`;
        return (
            <linearGradient key={`${brand}Gradient`} id={id} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={brandColor} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={brandColor} stopOpacity={0}/>
            </linearGradient>
        );
    }

    renderArea = (brand) => {
        const brandLabel = brand.replace(/\s/g, '');
        const color = this.brandColor(brand);
        const fill = `url(#color${brandLabel})`;
        return (
            <Area type="monotone" dataKey={brand} stroke={color} fillOpacity={1} fill={fill} key={`area${brand}`}/>
        );
    }


    render() {
        const {brands, data} = this.props;
        const allBrands = BRANDS.map((brand) => brand.landingBrand).filter((brand) => !!brand);
        const selectedBrands = brands.includes('Expedia Group') ? allBrands : brands;
        return (
            <Fragment>
                <h3>
                    {'Total bookings'}
                    <HelpText className="chart-info" text="Total Bookings for the last 24 hours, refreshes every minutes and display in UTC time" placement="bottom"/>
                </h3>
                <ResponsiveContainer width="90%" height="80%">
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
            </Fragment>
        );
    }
}
