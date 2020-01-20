import React from 'react';
import PropTypes from 'prop-types';
import ReactEcharts from 'echarts-for-react';
import DataTable from '../../../../components/DataTable/index';
import h from '../../incidentsHelper';

const overviewTablecolumns = ['Brand', 'P1', 'P2', 'Total', 'MTTD', 'MTTR', 'Total Duration'];

const renderTable = (filteredIncidents) => (
    <DataTable
        data={h.getIncMetricsByBrand(filteredIncidents)}
        columns={overviewTablecolumns}
        paginated={false}
    />
);

const formatSeriesForChart = (data = []) => (
    data
        .map((x) => ({
            name: x.serie,
            data: x.data,
            type: 'line'
        }))
);

const setChartOptions = (series = [], xAxisValues = []) => {
    const chartOpt = {
        legend: {
            data: series.map((x) => x.name)
        },
        tooltip: {},
        xAxis: {
            type: 'category',
            data: xAxisValues
        },
        yAxis: {
            name: 'Avg Duration (Hours)',
            nameLocation: 'middle',
            nameGap: 30,
            nameRotate: 90,
            type: 'value'
        },
        series
    };
    return chartOpt;
};

const renderChart = (data = [], dataToSeriesFunc, title) => {
    const series = formatSeriesForChart(dataToSeriesFunc(data));
    const dates = h.datesInterval(data);
    const xAxisValues = h.weeklyRange(dates[0], dates[1]);

    return (
        <div className="IncidentChartDiv" id={title.replace(/\s+/g, '-')}>
            <h3>{title}</h3>
            <ReactEcharts option={setChartOptions(series, xAxisValues)} key={Math.random()}/>
        </div>
    );
};

const renderResults = (filteredIncidents) => (
    <div>
        {renderTable(filteredIncidents)}
        {renderChart(filteredIncidents, h.weeklyMTTRMTTD, 'MTTD vs MTTR')}
        {renderChart(filteredIncidents, h.weeklyMTTDbyBrand, 'MTTD by Brand')}
        {renderChart(filteredIncidents, h.weeklyMTTRbyBrand, 'MTTR by Brand')}
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
};

Overview.propTypes = {
    filteredIncidents: PropTypes.arrayOf(PropTypes.shape()).isRequired
};

export default Overview;