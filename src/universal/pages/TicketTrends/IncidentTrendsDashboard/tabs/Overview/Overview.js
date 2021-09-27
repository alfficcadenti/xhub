import React from 'react';
import PropTypes from 'prop-types';
import LineChartWrapper from '../../../../../components/LineChartWrapper';
import NoResults from '../../../../../components/NoResults';
import DataTable from '../../../../../components/DataTable';
import {
    getIncMetricsByBrand,
    weeklyMTTRMTTD,
    weeklyMeanTimebyBrand,
    getWeeklyCounts
} from '../../../incidentsHelper';

const Overview = ({startDate, endDate, tickets, brand}) => {
    if (!tickets || !tickets.length) {
        return <NoResults />;
    }
    const {data: countData, keys: countKeys, yMax: countYMax} = getWeeklyCounts(startDate, endDate, tickets, 'open_date');
    const {data: mttdMttrData, keys: mttdMttrKeys, yMax: mttdMttrYMax} = weeklyMTTRMTTD(startDate, endDate, tickets);
    const {data: mttdData, keys: mttdKeys, yMax: mttdYMax} = weeklyMeanTimebyBrand(startDate, endDate, tickets, brand, 'time_to_detect');
    const {data: mttrData, keys: mttrKeys, yMax: mttrYMax} = weeklyMeanTimebyBrand(startDate, endDate, tickets, brand, 'time_to_restore');
    return (
        <div data-wdio="incidents-byBrand-table" id="inc-overview-table">
            <LineChartWrapper title="Incident Trends" data={countData} keys={countKeys} yMax={countYMax} helpText="Number of incidents per week by open date" />
            <DataTable
                data={getIncMetricsByBrand(tickets)}
                columns={['Brand', 'P1', 'P2', 'All', 'MTTD', 'MTTR', 'Total Duration']}
            />
            <LineChartWrapper title="MTTD vs MTTR" data={mttdMttrData} keys={mttdMttrKeys} yMax={mttdMttrYMax} helpText="Mean hours to detect vs Mean time to resolve per week" />
            <LineChartWrapper title="MTTD by Brand" data={mttdData} keys={mttdKeys} yMax={mttdYMax} helpText="Mean hours to detect per week" />
            <LineChartWrapper title="MTTR by Brand" data={mttrData} keys={mttrKeys} yMax={mttrYMax} helpText="Mean hours to resolve per week" />
        </div>
    );
};

Overview.propTypes = {
    tickets: PropTypes.arrayOf(PropTypes.shape()).isRequired
};

export default React.memo(Overview);
