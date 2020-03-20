import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import DataTable from '../../../../components/DataTable/index';
import LineChart from '../../../../components/LineChart/index';
import PieChart from '../../../../components/PieChart/index';
import {getQualityData} from '../../incidentsHelper';

const columns = ['Incident', 'Priority', 'Brand', 'Started', 'Summary', 'Duration', 'TTD', 'TTR', 'Root Cause Owners', 'Status'];

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

const getBucketCount = (filteredDefects, date, bucketSize) => {
    const lower = moment(date);
    const upper = moment(date).add(1, bucketSize);
    return filteredDefects
        .filter((defect) => (moment(defect.startedAt).isBetween(lower, upper, bucketSize, '[)')))
        .length;
};

const getLineData = (startDate, endDate, filteredDefects) => {
    const start = moment(startDate);
    const end = moment(endDate);
    const bucketSize = (start.diff(end, 'days') <= 14)
        ? 'days'
        : 'weeks';
    const axisData = [];
    const data = [];
    while (start.isSameOrBefore(end)) {
        axisData.push(start.format('YYYY-MM-DD'));
        data.push(getBucketCount(filteredDefects, start, bucketSize));
        start.add(1, bucketSize);
    }
    return {axisData, data};
};

const renderContent = (startDate, endDate, filteredDefects) => {
    const {axisData, data} = getLineData(startDate, endDate, filteredDefects);
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
