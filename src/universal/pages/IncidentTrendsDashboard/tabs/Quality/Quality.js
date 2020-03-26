import React from 'react';
import PropTypes from 'prop-types';

import DataTableWrapper from './DataTableWrapper/DataTableWrapper';
import LineChart from '../../../../components/LineChart/index';
import PieChart from '../../../../components/PieChart/index';
import HelpText from './../../../../components/HelpText/HelpText';
import {getLineData} from '../../incidentsHelper';
import './Quality.less';


const renderTable = (filteredIncidents) => (
    <div className="defects-table">
        <h3 className="section-header__text">{`Defects (${filteredIncidents.length} results)`}
            <HelpText text="Refresh every 15 minutes" />
        </h3>
        <DataTableWrapper filteredIncidents={filteredIncidents}/>
    </div>
);

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

const renderContent = (startDate, endDate, filteredDefects, selectedCovidTag) => {
    const {axisData, data} = getLineData(startDate, endDate, filteredDefects, 'openDate');
    const lineChartTitle = selectedCovidTag
        ? 'Defect Trends [covid-19]'
        : 'Defect Trends';
    return (
        <div className="quality-tab__content">
            <div data-wdio="defects-line-chart">
                <LineChart title={lineChartTitle} info="Defects are bucketed by Opened date." data={data} xAxis={axisData} />
            </div>
            <div data-wdio="defects-pie-charts">
                <PieChart data={getPieData(filteredDefects, 'Brand')} title="Brand" />
                <PieChart data={getPieData(filteredDefects, 'Status')} title="Status" />
                <PieChart data={getPieData(filteredDefects, 'priority')} title="Priority" />
            </div>
            {renderTable(filteredDefects)}
        </div>
    );
};

const renderNoResults = () => (
    <p>{'No Results Found'}</p>
);

const Quality = ({startDate, endDate, filteredDefects, selectedCovidTag}) => (
    <div data-wdio="quality-content">
        {
            filteredDefects.length
                ? renderContent(startDate, endDate, filteredDefects, selectedCovidTag)
                : renderNoResults()
        }
    </div>
);

Quality.propTypes = {
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    filteredDefects: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    selectedCovidTag: PropTypes.bool.isRequired
};

export default Quality;
