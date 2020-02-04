import React from 'react';
import ReactEcharts from 'echarts-for-react';
import {financialImpactTooltipFormatter} from '../../pages/incidentTrendsDashboard/incidentsHelper';
import './styles.less';

const tooltipBgColor = 'gainsboro';

const setChartOptions = (series = [], xAxisValues = [], tooltipData, yAxisName) => ({
    legend: {
        data: series.map((item) => item.name)
    },
    tooltip: tooltipData ? {
        trigger: 'item',
        formatter: financialImpactTooltipFormatter.bind(null, tooltipData),
        position(point) {
            return [point[0], point[1]];
        },
        enterable: true,
        backgroundColor: tooltipBgColor,
        textStyle: {
            fontWeight: 'bold',
            color: 'red'
        }
    } : {},
    xAxis: {
        type: 'category',
        data: xAxisValues
    },
    yAxis: {
        name: yAxisName ? yAxisName : '',
        nameLocation: 'middle',
        nameGap: 30,
        nameRotate: 90,
        type: 'value'
    },
    series
});


const ChartWrapper = ({tooltipData, series, xAxisValues, title, yAxisName}) => {
    return (
        <div className="chart-wrapper">
            <h3>{title}</h3>
            <ReactEcharts option={setChartOptions(series, xAxisValues, tooltipData, yAxisName)} key={Math.random()}/>
        </div>
    );
};

export default ChartWrapper;
