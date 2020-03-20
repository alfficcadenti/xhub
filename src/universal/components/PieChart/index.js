import React from 'react';
import ReactEcharts from 'echarts-for-react';
import './styles.less';

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

const doughnutchartStyle = {height: '450px', width: '350px'};

const PieChart = ({title, data}) => {
    return (
        <div className="pie-wrapper">
            <h3>{title}</h3>
            <ReactEcharts option={setChartOptions(data)} style={doughnutchartStyle} key={Math.random()}/>
        </div>
    );
};

export default PieChart;
