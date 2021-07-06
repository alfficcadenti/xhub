import React from 'react';
import {withRouter} from 'react-router-dom';
import './styles.less';
import GrafanaDashboard from '../../components/GrafanaDashboard';

const RealTimeSitePerformance = ({selectedBrands, availableBrands}) => {
    return (
        <GrafanaDashboard
            selectedBrands={selectedBrands}
            availableBrands={availableBrands}
            title="Real-Time Site Performance (RUM)"
            name="real-time-site-performance"
            url="https://opex-grafana.expedia.biz/d/na38i33iz/real-time-site-performance-rum?refresh=5m&orgId=2&theme=light"
        />
    );
};

export default withRouter(RealTimeSitePerformance);
