import React from 'react';
import ReactEcharts from 'echarts-for-react';

const setChartOptions = (data = [], xAxis = []) => ({
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


const LineChart = ({title, data, xAxis}) => {
    return (
        <div className="linechart-wrapper">
            <h3>{title}</h3>
            <ReactEcharts option={setChartOptions(data, xAxis)} key={Math.random()}/>
        </div>
    );
};

export default LineChart;
