import React, {PureComponent, Fragment} from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import HelpText from '../../components/HelpText/HelpText';
import {EXPEDIA_BRAND, VRBO_BRAND, HOTELS_COM_BRAND, EXPEDIA_PARTNER_SERVICES_BRAND, BRANDS} from '../../constants';
import {isNotEmptyString} from '../../pages/utils';

export default class PageView extends PureComponent {
    brandColor = (brand) => {
        switch (brand) {
            case EXPEDIA_BRAND:
                return '#1B5CAF';
            case VRBO_BRAND:
                return '#1478F7';
            case HOTELS_COM_BRAND:
                return '#F71414';
            case EXPEDIA_PARTNER_SERVICES_BRAND:
                return '#FFC72C';
            default:
                return '#1B5CAF';
        }
    };

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
    };

    renderArea = (brand) => {
        const brandLabel = brand.replace(/\s/g, '');
        const color = this.brandColor(brand);
        const fill = `url(#color${brandLabel})`;
        return (
            <Area type="monotone" dataKey={brand} stroke={color} fillOpacity={1} fill={fill} key={`area${brand}`} />
        );
    };


    render() {
        const {brands, data, title} = this.props;
        const allBrands = BRANDS.map((brand) => brand.landingBrand).filter(isNotEmptyString);
        const selectedBrands = brands.includes('Expedia Group') ? allBrands : brands;
        return (
            <Fragment>
                <h3>
                    {title}
                    <HelpText className="chart-info" text="Traveler page views" placement="bottom" />
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
