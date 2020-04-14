import React from 'react';
import ReactEcharts from 'echarts-for-react';
import './styles.less';
import NoResults from '../NoResults/NoResults';

const setChartOptions = (data = []) => ({
    legend: {
        type: 'scroll',
        orient: '',
        selectedMode: false,
        x: 'center',
        y: 'bottom',
        height: 150,
        padding: 10
    },
    series: [
        {
            name: 'Chart',
            type: 'pie',
            radius: ['80%', '35%'],
            avoidLabelOverlap: true,
            top: '-25%',
            label: {
                normal: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    show: true,
                    formatter: '{d}% \n {b}',
                    textStyle: {
                        fontSize: '14',
                        fontWeight: 'bold'
                    }
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data
        }
    ]
});

const renderChart = (data, onChartClick) => {
    const doughnutchartStyle = {height: '450px', width: '350px'};
    const onEvents = {
        'click': onChartClick
    };
    return (
        <ReactEcharts option={setChartOptions(data)} onEvents={onEvents} style={doughnutchartStyle} key={Math.random()}/>
    );
};

const PieChart = ({
    title,
    data,
    onChartClick
}) => {
    return (
        <div className="pie-wrapper">
            <h3>{title}</h3>
            {data && data.length ? renderChart(data, onChartClick) : <NoResults />}
        </div>
    );
};

export default PieChart;
