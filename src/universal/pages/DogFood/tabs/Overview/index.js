import React from 'react';
import PieChart from '../../../../components/PieChart';
import {getPieData} from '../../../utils';
import './styles.less';

const Overview = ({
    issues
}) => (
    <div className="overview-charts">
        <PieChart
            data={getPieData(issues, 'project')}
            title="Project"
        />
        <PieChart
            data={getPieData(issues, 'status')}
            title="Status"
        />
    </div>
);

export default Overview;