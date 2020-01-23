import React from 'react';
import PropTypes from 'prop-types';
import ReactEcharts from 'echarts-for-react';
import DataTable from '../../../../components/DataTable/index';
import h from '../../incidentsHelper';

const overviewTableColumns = ['Brand', 'P1', 'P2', 'Total', 'MTTD', 'MTTR', 'Total Duration'];

const formatSeriesForChart = (data = []) => data
    .map((x) => ({
        name: x.serie,
        data: x.data,
        type: 'line'
    }));

const setChartOptions = (series = [], xAxisValues = []) => {
    return {
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
};

const renderChart = (data = [], dataToSeriesFunc, title) => {
    const series = formatSeriesForChart(dataToSeriesFunc(data));
    const dates = h.getMarginDateValues(data);
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
        <DataTable
            data={h.getIncMetricsByBrand(filteredIncidents)}
            columns={overviewTableColumns}
            paginated={false}
        />
        {renderChart(filteredIncidents, h.weeklyMTTRMTTD, 'MTTD vs MTTR')}
        {renderChart(filteredIncidents, h.weeklyMTTDbyBrand, 'MTTD by Brand')}
        {renderChart(filteredIncidents, h.weeklyMTTRbyBrand, 'MTTR by Brand')}
    </div>
);

const Overview = (props) => {
    return (<div data-wdio="incidents-byBrand-table" id="inc-overview-table">
        {
            props.filteredIncidents.length
                ? renderResults(props.filteredIncidents)
                : <p>{'No Results Found'}</p>
        }
    </div>
    );
};

Overview.propTypes = {
    filteredIncidents: PropTypes.arrayOf(PropTypes.shape()).isRequired
};

export default Overview;
