import React from 'react';
import ReactEcharts from 'echarts-for-react';
import './styles.less';

const setChartOptions = (data = []) => ({
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    legend: {
        type: 'scroll',
        orient: 'vertical',
        bottom: 16
    },
    series: [
        {
            name: '',
            type: 'pie',
            radius: '75%',
            center: ['50%', '40%'],
            data,
            animation: false,
            label: {
                position: 'inside'
            }
        }
    ]
});


const PieChart = ({title, data}) => {
    return (
        <div className="pie-wrapper">
            <h3>{title}</h3>
            <ReactEcharts option={setChartOptions(data)} key={Math.random()}/>
        </div>
    );
};

export default PieChart;
