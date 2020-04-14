import React from 'react';
import PropTypes from 'prop-types';
import DataTableWrapper from '../../../../components/DataTableWrapper/DataTableWrapper';
import LineChart from '../../../../components/LineChart/index';
import PieChart from '../../../../components/PieChart/index';
import HelpText from './../../../../components/HelpText/HelpText';
import NoResults from './../../../../components/NoResults/NoResults';
import {getLineData} from '../../incidentsHelper';
import {getPieData} from '../../../utils';
import './Quality.less';


const renderTable = (filteredIncidents) => (
    <div className="defects-table">
        <h3 className="section-header__text">{`Defects (${filteredIncidents.length} results)`}
            <HelpText text="Refresh every 15 minutes" />
        </h3>
        <DataTableWrapper filteredIncidents={filteredIncidents} incidentType="defects" />
    </div>
);

const renderContent = (
    startDate,
    endDate,
    filteredDefects,
    selectedCovidTag,
    setIsApplyClicked,
    handleBrandChange,
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
                    onChartClick={generateChartClickHandler(handleBrandChange)}
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
            {renderTable(filteredDefects)}
        </div>
    );
};

const Quality = ({
    startDate,
    endDate,
    filteredDefects,
    selectedCovidTag,
    setIsApplyClicked,
    handleBrandChange,
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
                    handleBrandChange,
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
