import React from 'react';
import PieChart from '../../../../components/PieChart';
import {getPieData} from '../../../utils';

const Overview = ({
    tickets, generateChartClickHandler, onOrgChange, onStatusChange, onPriorityChange
}) => (
    <div className="overview-charts">
        <PieChart
            data={getPieData(tickets, 'Owning Org')}
            title="Owning Org"
            onChartClick={generateChartClickHandler(onOrgChange)}
        />
        <PieChart
            data={getPieData(tickets, 'Status')}
            title="Status"
            onChartClick={generateChartClickHandler(onStatusChange)}
        />
        <PieChart
            data={getPieData(tickets, 'Priority')}
            title="Priority"
            handlePriorityChange={onPriorityChange}
            onChartClick={generateChartClickHandler(onPriorityChange)}
        />
    </div>
);

export default Overview;