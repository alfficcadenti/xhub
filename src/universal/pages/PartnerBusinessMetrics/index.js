import React from 'react';
import {withRouter} from 'react-router-dom';
import {Alert} from '@homeaway/react-alerts';
import GrafanaDashboard from '../../components/GrafanaDashboard';

const PartnerBusinessMetrics = ({selectedBrands, availableBrands}) => {
    const alertMsg = (
        <p>
            {'This dashboard is deprecated and will soon be removed. If you are still using this dashboard, please notify us on '}
            <a href="https://expedia.slack.com/archives/C01A9U8GY2G" target="_blank" rel="noopener noreferrer">{'#opxhub-support'}</a>
        </p>
    );
    return (
        <>
            <Alert msg={alertMsg} />
            <GrafanaDashboard
                selectedBrands={selectedBrands}
                availableBrands={availableBrands}
                name="partner-business-metrics"
                title="Partner Business Metrics"
                url="https://opexhub-grafana.expedia.biz/d/2D1iGCgnk/vrbo-business-partner-metrics?orgId=1&theme=light"
            />
        </>
    );
};

export default withRouter(PartnerBusinessMetrics);
