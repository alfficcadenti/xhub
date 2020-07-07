import React from 'react';
import {AreaChart, XAxis, YAxis, Area, Tooltip, ResponsiveContainer, CartesianGrid} from 'recharts';
import {getBrand} from '../../constants';
import './styles.less';

// eslint-disable-next-line complexity
const CustomTooltip = ({active, payload}) => {
    if (active && payload[0] && payload[0].payload && payload[0].payload.label && payload[0].value) {
        return (
            <div className="custom-tooltip">
                <p className="label">{`${payload[0].payload.label} : ${payload[0].value}`}</p>
            </div>
        );
    }
    return null;
};

const PageviewWidget = ({title = '', data = [], brand}) => {
    const brandLabel = brand.replace(/\s/g, '');
    const fill = `url(#${brandLabel})`;
    const {color} = getBrand(brand);
    return (
        <div className="widget-card card" key={title}>
            <h3>{title}</h3>
            {
                data.length ?
                    <ResponsiveContainer width="100%" height="80%">
                        <AreaChart width={100} height={100} data={data}>
                            <defs>
                                <linearGradient key={`${title}Gradient`} id={brandLabel} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="time" />
                            <YAxis />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="value" stroke={color} fillOpacity={1} fill={fill} key={`area${brand}`}/>
                        </AreaChart>
                    </ResponsiveContainer> :
                    <div className="recharts-empty-container" />
            }
        </div>
    );
};

export default PageviewWidget;
