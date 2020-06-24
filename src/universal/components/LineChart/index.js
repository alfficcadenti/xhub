import React from 'react';
import ReactEcharts from 'echarts-for-react';
import Tooltip from '@homeaway/react-tooltip';
import {SVGIcon} from '@homeaway/react-svg';
import {INFO__16} from '@homeaway/svg-defs';
import './styles.less';

const setChartOptions = (data = [], xAxis = []) => ({
    tooltip: {},
    grid: {
        left: 24,
        top: 24
    },
    xAxis: {
        type: 'category',
        data: xAxis
    },
    yAxis: {
        type: 'value'
    },
    series: [{
        data,
        type: 'line'
    }]
});


const LineChart = ({title, info, data, xAxis}) => {
    return (
        <div className="linechart-wrapper">
            <h3 className="chart-header">{title}</h3>
            <div className="chart-info">
                <Tooltip tooltipType="tooltip--lg" content={info}>
                    <SVGIcon inlineFlex markup={INFO__16} />
                </Tooltip>
            </div>
            <ReactEcharts option={setChartOptions(data, xAxis)}/>
        </div>
    );
};

export default LineChart;
