import React from 'react';
import PropTypes from 'prop-types';

import DataTable from '../../../../components/DataTable/index';
import LineChart from '../../../../components/LineChart/index';
import PieChart from '../../../../components/PieChart/index';
import {getQualityData, getLineData} from '../../incidentsHelper';

const columns = ['Defect', 'Priority', 'Brand', 'Opened', 'Resolved', 'Summary', 'Project', 'Duration', 'Impacted Brand', 'Status'];

const columnsInfo = {
    Started: (<div><b>{'Started'}</b><br />{'Displayed in browser'}&apos;{'s local time'}</div>)
};

const getPieData = (filteredDefects, property) => {
    const counts = filteredDefects
        .reduce((acc, curr) => {
            const key = curr[property];
            if (!acc[key]) {
                acc[key] = 0;
            }
            acc[key]++;
            return acc;
        }, {});
    return Object.entries(counts).map(([name, value]) => ({name, value}));
};

const renderContent = (startDate, endDate, filteredDefects) => {
    const {axisData, data} = getLineData(startDate, endDate, filteredDefects, 'openDate');
    return (
        <>
            <div data-wdio="defects-line-chart">
                <LineChart title="Defects Trend" data={data} xAxis={axisData} />
            </div>
            <div data-wdio="defects-pie-charts">
                <PieChart data={getPieData(filteredDefects, 'Brand')} title="Brand" />
                <PieChart data={getPieData(filteredDefects, 'Status')} title="Status" />
                <PieChart data={getPieData(filteredDefects, 'priority')} title="Priority" />
            </div>
            <div data-wdio="defects-table">
                <DataTable
                    data={getQualityData(filteredDefects)}
                    columns={columns}
                    columnsInfo={columnsInfo}
                    paginated
                />
            </div>
        </>
    );
};

const renderNoResults = () => (
    <p>{'No Results Found'}</p>
);

const Quality = ({startDate, endDate, filteredDefects}) => (
    <div data-wdio="quality-content">
        {
            filteredDefects.length
                ? renderContent(startDate, endDate, filteredDefects)
                : renderNoResults()
        }
    </div>
);

Quality.propTypes = {
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    filteredDefects: PropTypes.arrayOf(PropTypes.shape()).isRequired
};

export default Quality;
