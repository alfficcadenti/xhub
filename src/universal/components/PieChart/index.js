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

const PieChart = ({
    title,
    data,
    setIsApplyClicked,
    handleBrandChange,
    handleStatusChange,
    handlePriorityChange
}) => {
    const onChartClick = (e) => {
        const chartName = e.data.name;

        if (title === 'Brand') {
            handleBrandChange(chartName);
        } else if (title === 'Status') {
            handleStatusChange(chartName);
        } else if (title === 'Priority') {
            handlePriorityChange(chartName);
        }

        setIsApplyClicked(true);
    };
    const doughnutchartStyle = {height: '450px', width: '350px'};
    const onEvents = {
        'click': onChartClick
    };

    return (
        <div className="pie-wrapper">
            <h3>{title}</h3>
            <ReactEcharts option={setChartOptions(data)} onEvents={onEvents} style={doughnutchartStyle} key={Math.random()}/>
        </div>
    );
};

export default PieChart;
