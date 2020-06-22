import React from 'react';
import PropTypes from 'prop-types';
import DataTable from '../../../../../components/DataTable';
import LineChart from '../../../../../components/LineChart';
import PieChart from '../../../../../components/PieChart';
import NoResults from '../../../../../components/NoResults/NoResults';
import {getQualityData, getLineData} from '../../../incidentsHelper';
import {getPieData} from '../../../../utils';
import './Quality.less';

const renderContent = (
    startDate,
    endDate,
    filteredDefects,
    selectedCovidTag,
    setIsApplyClicked,
    handleStatusChange,
    handlePriorityChange
) => {
    const {axisData, data} = getLineData(startDate, endDate, filteredDefects, 'openDate');
    const lineChartTitle = selectedCovidTag
        ? 'Defect Trends [covid-19]'
        : 'Defect Trends';
    const generateChartClickHandler = (handler) => (e) => {
        const chartName = e.data.name;
        handler(chartName);
        setIsApplyClicked(true);
    };
    return (
        <div className="quality-tab__content">
            <div data-wdio="defects-line-chart">
                <LineChart title={lineChartTitle} info="Defects are bucketed by Opened date." data={data} xAxis={axisData} />
            </div>
            <div data-wdio="defects-pie-charts">
                <PieChart
                    data={getPieData(filteredDefects, 'Brand')}
                    title="Brand"
                />
                <PieChart
                    data={getPieData(filteredDefects, 'Status')}
                    title="Status"
                    onChartClick={generateChartClickHandler(handleStatusChange)}
                />
                <PieChart
                    data={getPieData(filteredDefects, 'priority')}
                    title="Priority"
                    handlePriorityChange={handlePriorityChange}
                    onChartClick={generateChartClickHandler(handlePriorityChange)}
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
    selectedCovidTag,
    setIsApplyClicked,
    handleStatusChange,
    handlePriorityChange
}) => (
    <div data-wdio="quality-content">
        {
            filteredDefects.length
                ? renderContent(
                    startDate,
                    endDate,
                    filteredDefects,
                    selectedCovidTag,
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
    filteredDefects: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    selectedCovidTag: PropTypes.bool.isRequired
};

export default React.memo(Quality);
