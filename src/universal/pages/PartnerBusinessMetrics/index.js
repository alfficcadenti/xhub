import React from 'react';
import {withRouter} from 'react-router-dom';
import './styles.less';
import GrafanaDashboard from '../../components/GrafanaDashboard';

const PartnerBusinessMetrics = () => {
    return (
        <GrafanaDashboard
            name="partner-business-metrics"
            title="Partner Business Metrics"
            url="https://opexhub-grafana.expedia.biz/d/2D1iGCgnk/vrbo-business-partner-metrics?orgId=1&theme=light"
        />
    );
};

export default withRouter(PartnerBusinessMetrics);
