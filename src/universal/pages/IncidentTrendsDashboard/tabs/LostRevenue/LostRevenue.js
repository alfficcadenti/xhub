import React from 'react';
import ReactEcharts from 'echarts-for-react';
import {
    buildBrandLossData,
    lostRevenueTooltipFormatter
} from '../../incidentsHelper';

const tooltipBgColor = 'gainsboro';

const setChartOptions = (series = [], xAxisValues = [], tooltipData) => ({
    legend: {
        data: series.map((item) => item.name)
    },
    tooltip: {
        trigger: 'item',
        formatter: lostRevenueTooltipFormatter.bind(null, tooltipData),
        position(point) {
            return [point[0], point[1]];
        },
        enterable: true,
        backgroundColor: tooltipBgColor,
        textStyle: {
            fontWeight: 'bold',
            color: 'red'
        }
    },
    xAxis: {
        type: 'category',
        data: xAxisValues
    },
    yAxis: {
        nameLocation: 'middle',
        nameGap: 30,
        nameRotate: 90,
        type: 'value'
    },
    series
});

const renderChart = (data = []) => {
    const {tooltipData, series, weekIntervals: xAxisValues} = buildBrandLossData(data);

    return (
        <div className="IncidentChartDiv">
            <h3>{'Lost Revenues by Brand'}</h3>
            <ReactEcharts option={setChartOptions(series, xAxisValues, tooltipData)} key={Math.random()}/>
        </div>
    );
};

const LostRevenue = ({filteredLostRevenues}) => {
    return (<div id="lost-revenue">
        {
            (filteredLostRevenues && filteredLostRevenues.length) ?
                renderChart(filteredLostRevenues) : <p>{'No Results Found'}</p>
        }
    </div>);
};

export default LostRevenue;
