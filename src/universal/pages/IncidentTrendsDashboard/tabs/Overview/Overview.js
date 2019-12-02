import React from 'react';
import PropTypes from 'prop-types';
import ReactEcharts from 'echarts-for-react';
import DataTable from '../../../../components/DataTable/index';
import h from '../../incidentsHelper';

const overviewTablecolumns = ['Brand', 'P1', 'P2', 'Total', 'MTTR', 'Total Duration'];

const renderTable = (filteredIncidents) => (
    <DataTable
        data={h.getIncMetricsByBrand(filteredIncidents)}
        columns={overviewTablecolumns}
        paginated={false}
    />
);

const getMTTRbyBrandForChart = (inc) => (
    h.weeklyMTTRbyBrand(inc)
        .map(x => ({
            name: x.brand, 
            data: x.data, 
            type: 'line'
        }))
)

const setOption = (series,weeks) => {
    const chartOpt = {
        legend: {
            data: series.map(x=>x.name)
        },
        tooltip: {},
        xAxis: {
            type: 'category',
            data: weeks
        },
        yAxis: {
            name: 'Avg Duration (Hours)',
            nameLocation: 'middle',
            nameGap: 30,
            nameRotate: 90,
            type: 'value'
        },
            series: series
    }
    return chartOpt
}

const renderChart = (filteredIncidents) => {
    const series = getMTTRbyBrandForChart(filteredIncidents);
    const weeksInt = h.weeksInterval(filteredIncidents);
    const weeks = h.range(weeksInt[0],weeksInt[1]).map(x=>'week '+x)

    return (
        <div id='MTTRChartDiv'>
            <h3>MTTR by Brand</h3>
            <ReactEcharts option={setOption(series,weeks)}/>
        </div>
    )
}

const renderResults = (filteredIncidents) => (
    <div>
        {renderTable(filteredIncidents)}
        {renderChart(filteredIncidents)}
    </div>
);

const renderNoResults = () => (
    <p>No Results Found</p>
);

const Overview = (props) => {
    return (<div data-wdio="incidents-byBrand-table" id="inc-overview-table"> 
        {
            props.filteredIncidents.length
                ? renderResults(props.filteredIncidents)
                : renderNoResults()
        }
    </div>
    );
}

Overview.propTypes = {
    filteredIncidents: PropTypes.arrayOf(PropTypes.shape()).isRequired
};

export default Overview;
