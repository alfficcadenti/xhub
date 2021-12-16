import React from 'react';
import {withRouter} from 'react-router-dom';
import GrafanaDashboard from '../../components/GrafanaDashboard';

const PartnerBusinessMetrics = ({selectedBrands, availableBrands}) => {
    return (
        <GrafanaDashboard
            selectedBrands={selectedBrands}
            availableBrands={availableBrands}
            name="partner-business-metrics"
            title="Partner Business Metrics"
            url="https://opexhub-grafana.expedia.biz/d/2D1iGCgnk/vrbo-business-partner-metrics?orgId=1&theme=light"
        />
    );
};

export default withRouter(PartnerBusinessMetrics);
