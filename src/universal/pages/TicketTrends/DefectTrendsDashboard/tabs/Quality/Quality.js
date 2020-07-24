import React from 'react';
import PropTypes from 'prop-types';
import DataTable from '../../../../../components/DataTable';
import LineChartWrapper from '../../../../../components/LineChartWrapper';
import PieChart from '../../../../../components/PieChart';
import NoResults from '../../../../../components/NoResults/NoResults';
import {getQualityData, getWeeklyCounts} from '../../../incidentsHelper';
import {getPieData} from '../../../../utils';
import './Quality.less';

const renderContent = (
    startDate,
    endDate,
    filteredDefects,
    setIsApplyClicked,
    handleStatusChange,
    handlePriorityChange
) => {
    const {data, keys} = getWeeklyCounts(startDate, endDate, filteredDefects, 'openDate');
    const generateChartClickHandler = (handler) => (e) => {
        const chartName = e.data.name;
        handler(chartName);
        setIsApplyClicked(true);
    };
    return (
        <div className="quality-tab__content">
            <div data-wdio="defects-line-chart">
                <LineChartWrapper title="Quality Trends" data={data} keys={keys} helpText="Defects are bucketed by Opened date" />
            </div>
            <div data-wdio="defects-pie-charts">
                <PieChart
                    data={getPieData(filteredDefects, 'Brand')}
                    title="Brand"
                    dataKey="value"
                />
                <PieChart
                    data={getPieData(filteredDefects, 'Status')}
                    title="Status"
                    onChartClick={generateChartClickHandler(handleStatusChange)}
                    dataKey="value"
                />
                <PieChart
                    data={getPieData(filteredDefects, 'priority')}
                    title="Priority"
                    handlePriorityChange={handlePriorityChange}
                    onChartClick={generateChartClickHandler(handlePriorityChange)}
                    dataKey="value"
                />
            </div>
            <DataTable
                className="defects-table"
                title={`Defects (${filteredDefects.length} results)`}
                info="Refreshes every 15 minutes"
                data={getQualityData(filteredDefects)}
                columns={['Defect', 'Priority', 'Brand', 'Opened', 'Resolved', 'Summary', 'Project', 'Duration', 'Impacted Brand', 'Status']}
                columnsInfo={{
                    Brand: <div>{'Displaying brand(s) selected by'}<br/>{'dropdown [top right in site header]'}</div>
                }}
                pageSize={25}
                paginated
                csvFilename="DefectsResults.csv"
                enableCSVDownload
            />
        </div>
    );
};

const Quality = ({
    startDate,
    endDate,
    filteredDefects,
    setIsApplyClicked,
    handleStatusChange,
    handlePriorityChange
}) => (
    <div className="quality-content">
        {
            filteredDefects.length
                ? renderContent(
                    startDate,
                    endDate,
                    filteredDefects,
                    setIsApplyClicked,
                    handleStatusChange,
                    handlePriorityChange
                )
                : <NoResults />
        }
    </div>
);

Quality.propTypes = {
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    filteredDefects: PropTypes.arrayOf(PropTypes.shape()).isRequired
};

export default React.memo(Quality);
