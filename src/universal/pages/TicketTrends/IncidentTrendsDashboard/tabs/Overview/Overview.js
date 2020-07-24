import React from 'react';
import PropTypes from 'prop-types';
import LineChartWrapper from '../../../../../components/LineChartWrapper';
import NoResults from '../../../../../components/NoResults/NoResults';
import DataTable from '../../../../../components/DataTable';
import {
    getIncMetricsByBrand,
    weeklyMTTRMTTD,
    weeklyMTTRbyBrand,
    weeklyMTTDbyBrand,
    getWeeklyCounts
} from '../../../incidentsHelper';

const Overview = ({startDate, endDate, filteredIncidents}) => {
    if (!filteredIncidents || !filteredIncidents.length) {
        return <NoResults />;
    }
    const {data: countData, keys: countKeys, yMax: countYMax} = getWeeklyCounts(startDate, endDate, filteredIncidents, 'openDate');
    const {data: mttdMttrData, keys: mttdMttrKeys, yMax: mttdMttrYMax} = weeklyMTTRMTTD(filteredIncidents);
    const {data: mttdData, keys: mttdKeys, yMax: mttdYMax} = weeklyMTTDbyBrand(filteredIncidents);
    const {data: mttrData, keys: mttrKeys, yMax: mttrYMax} = weeklyMTTRbyBrand(filteredIncidents);
    return (
        <div data-wdio="incidents-byBrand-table" id="inc-overview-table">
            <LineChartWrapper title="Incident Trends" data={countData} keys={countKeys} yMax={countYMax} helpText="Incidents are bucketed by Opened date" />
            <DataTable
                data={getIncMetricsByBrand(filteredIncidents)}
                columns={['Brand', 'P1', 'P2', 'All', 'MTTD', 'MTTR', 'Total Duration']}
            />
            <LineChartWrapper title="MTTD vs MTTR" data={mttdMttrData} keys={mttdMttrKeys} yMax={mttdMttrYMax} />
            <LineChartWrapper title="MTTD by Brand" data={mttdData} keys={mttdKeys} yMax={mttdYMax} />
            <LineChartWrapper title="MTTR by Brand" data={mttrData} keys={mttrKeys} yMax={mttrYMax} />
        </div>
    );
};

Overview.propTypes = {
    filteredIncidents: PropTypes.arrayOf(PropTypes.shape()).isRequired
};

export default React.memo(Overview);
