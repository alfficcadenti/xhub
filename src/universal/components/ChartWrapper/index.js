import React from 'react';
import ReactEcharts from 'echarts-for-react';
import './styles.less';

const tooltipBgColor = 'gainsboro';
const formatToUSDollarCurrency = (number) => number.
    toLocaleString('en-US', {style: 'currency', currency: 'USD'});
const setChartOptions = (series = [], xAxisValues = [], tooltipData, yAxisName) => ({
    legend: {
        left: 0,
        data: series.map((item) => item.name)
    },
    grid: {
        left: 0
    },
    tooltip: tooltipData ? {
        trigger: 'item',
        formatter({name, seriesName}) {
            const incidents = tooltipData[name][seriesName];
            const incidentsString = incidents.map((item) => {
                return `<div class="incident-wrapper">
                        <span class="incident-number">${item.incidentNumberLink}</span>
                        <span class="incident-financial-impact">${formatToUSDollarCurrency(item.lostRevenue)}</span>
                        </div>`;
            }).join('');

            return `<div class="financial-impact-tooltip">
                <p class="brand-name">${seriesName}</p>
                ${incidentsString}
            </div>`;
        },
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
