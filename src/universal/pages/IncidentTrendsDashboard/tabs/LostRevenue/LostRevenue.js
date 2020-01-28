import React from 'react';
import ReactEcharts from 'echarts-for-react';
import {
    prepareBrandLossData
} from '../../incidentsHelper';


const setChartOptions = (series = [], xAxisValues = [], tooltipData) => ({
    legend: {
        data: series.map((x) => x.name)
    },
    tooltip: {
        trigger: 'item',
        formatter({name, seriesName}) {
            const incidents = tooltipData[name][seriesName];
            const incidentsString = incidents.map((item) => {
                return `<div class="incident-wrapper">
                        <span class="incident-number">${item.incidentNumberLink}</span>
                        <span class="incident-lost-revenue">${item.lostRevenue}</span>
                        </div>`;
            }).join('');

            return `<div class="lost-revenue-tooltip">${incidentsString}</div>`;
        },
        position(point) {
            return [point[0], point[1]];
        },
        enterable: true,
        backgroundColor: 'gainsboro',
        textStyle: {
            fontWeight: 'bold'
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
    const {tooltipData, series, weekIntervals: xAxisValues} = prepareBrandLossData(data);

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
