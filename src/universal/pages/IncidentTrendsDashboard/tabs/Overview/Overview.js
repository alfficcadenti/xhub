import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import DataTable from '../../../../components/DataTable/index';
import ChartWrapper from '../../../../components/ChartWrapper';
import {
    getMarginDateValues,
    getIncMetricsByBrand,
    weeklyMTTRMTTD,
    weeklyMTTRbyBrand,
    weeklyMTTDbyBrand,
    weeklyRange,
    formatSeriesForChart
} from '../../incidentsHelper';

const overviewTableColumns = ['Brand', 'P1', 'P2', 'Total', 'MTTD', 'MTTR', 'Total Duration'];

const Overview = ({filteredIncidents}) => {
    const mttdVsMttrSeries = formatSeriesForChart(weeklyMTTRMTTD(filteredIncidents));
    const mttdByBrandSeries = formatSeriesForChart(weeklyMTTDbyBrand(filteredIncidents));
    const mttrByBrandSeries = formatSeriesForChart(weeklyMTTRbyBrand(filteredIncidents));
    const dates = getMarginDateValues(filteredIncidents);
    const xAxisValues = weeklyRange(dates[0], dates[1]);

    return (<div data-wdio="incidents-byBrand-table" id="inc-overview-table">
        {
            filteredIncidents && filteredIncidents.length ?
                <Fragment>
                    <DataTable
                        data={getIncMetricsByBrand(filteredIncidents)}
                        columns={overviewTableColumns}
                        paginated={false}
                    />
                    <ChartWrapper
                        series={mttdVsMttrSeries}
                        xAxisValues={xAxisValues}
                        title="MTTD vs MTTR"
                        yAxisName="Avg Duration (Hours)"
                    />
                    <ChartWrapper
                        series={mttdByBrandSeries}
                        xAxisValues={xAxisValues}
                        title="MTTD by Brand"
                        yAxisName="Avg Duration (Hours)"
                    />
                    <ChartWrapper
                        series={mttrByBrandSeries}
                        xAxisValues={xAxisValues}
                        title="MTTR by Brand"
                        yAxisName="Avg Duration (Hours)"
                    />
                </Fragment> :
                <p>{'No Results Found'}</p>
        }
    </div>
    );
};

Overview.propTypes = {
    filteredIncidents: PropTypes.arrayOf(PropTypes.shape()).isRequired
};

export default Overview;
