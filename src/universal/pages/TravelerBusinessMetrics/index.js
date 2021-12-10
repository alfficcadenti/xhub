import React from 'react';
import {withRouter} from 'react-router-dom';
import GrafanaDashboard from '../../components/GrafanaDashboard';

const TravelerBusinessMetrics = ({selectedBrands, availableBrands}) => {
    return (
        <GrafanaDashboard
            selectedBrands={selectedBrands}
            availableBrands={availableBrands}
            name="traveler-business-metrics"
            title="Traveler Business Metrics"
            url="https://opexhub-grafana.expedia.biz/d/39um3NZ7k/traveler-business-metrics?orgId=1&var-displayAnnotation=Incidents&var-incidentPriority=All&theme=light"
        />
    );
};

export default withRouter(TravelerBusinessMetrics);
