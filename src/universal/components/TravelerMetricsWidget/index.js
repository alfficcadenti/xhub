import React from 'react';
import moment from 'moment';
import {
    AreaChart,
    XAxis,
    YAxis,
    Area,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    ReferenceArea,
    ReferenceLine
} from 'recharts';
import {v1 as uuid} from 'uuid';
import HelpText from '../HelpText/HelpText';
import ReferenceLabel from '../ReferenceLabel';
import {getBrand} from '../../pages/utils';
import {DEPLOYMENT_ANNOTATION_CATEGORY} from '../../constants';
import './styles.less';

// eslint-disable-next-line complexity
const CustomTooltip = ({active, payload}) => {
    if (active && payload && payload[0] && payload[0].payload && payload[0].payload.label && payload[0].value) {
        return (
            <div className="custom-tooltip">
                <p className="label">{payload[0].payload.label}</p>
                {payload && payload.map((x) => <p className="label">{`${x.dataKey} = ${x.value}`}</p>)}
            </div>
        );
    }
    return null;
};

const formatXAxis = (date) => moment(date).format('MM/DD hh:mm');

const renderHeader = (title, helpText) => (
    <h3>
        {title}
        {helpText && <HelpText text="Only for nonNativeApps" />}
    </h3>
);

const TravelerMetricsWidget = ({
    title = '',
    data = [],
    brand,
    tickGap = 5,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    chartLeft,
    chartRight,
    refAreaLeft,
    refAreaRight,
    helpText,
    annotations = [],
    selectedLoB = []
}) => {
    const brandLabel = brand.replace(/\s/g, '');
    const fill = `url(#${brandLabel})`;
    const {color} = getBrand(brand, 'label');
    const yAxisId = `yAxis-${title}`;
    return (
        <div className="widget-card card" key={title}>
            {renderHeader(title, helpText)}
            {
                data.length ?
                    <ResponsiveContainer width="100%" height="80%">
                        <AreaChart
                            width={100}
                            height={100}
                            data={data}
                            syncId="pageview-widget"
                            onMouseDown={onMouseDown}
                            onMouseMove={onMouseMove}
                            onMouseUp={onMouseUp}
                            cursor="crosshair"
                        >
                            <defs>
                                <linearGradient key={`${title}Gradient`} id={brandLabel} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis
                                allowDataOverflow
                                dataKey="time"
                                minTickGap={tickGap}
                                tickFormatter={formatXAxis}
                                domain={[chartLeft, chartRight]}
                                tick={{fontSize: 10}}
                            />
                            <YAxis
                                allowDataOverflow
                                type="number"
                                yAxisId={yAxisId}
                                tick={{fontSize: 10}}
                                domain={['auto', 'auto']}
                            />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Tooltip content={<CustomTooltip />} />
                            {selectedLoB && selectedLoB.length ?
                                selectedLoB.map((lob) =>
                                    <Area stackId="1" type="monotone" dataKey={lob.label} stroke={color} fillOpacity={1} fill={fill} key={`area${lob.label}`} yAxisId={yAxisId} />
                                ) :
                                <Area type="monotone" dataKey="Views" stroke={color} fillOpacity={1} fill={fill} key={`area${brand}`} yAxisId={yAxisId} />
                            };
                            {
                                annotations && annotations.map((annotation) => (
                                    <ReferenceLine
                                        key={uuid()}
                                        yAxisId={yAxisId}
                                        x={annotation.bucketTime}
                                        label={<ReferenceLabel annotation={annotation} />}
                                        stroke={annotation.category === DEPLOYMENT_ANNOTATION_CATEGORY ? 'red' : 'green'}
                                        strokeDasharray="3 3"
                                        isFront
                                    />
                                ))
                            }
                            {
                                (refAreaLeft && refAreaRight)
                                    ? <ReferenceArea yAxisId={yAxisId} x1={refAreaLeft} x2={refAreaRight} strokeOpacity={0.3} />
                                    : null
                            }
                        </AreaChart>
                    </ResponsiveContainer> :
                    <div className="recharts-empty-container" />
            }
        </div>
    );
};

export default TravelerMetricsWidget;
