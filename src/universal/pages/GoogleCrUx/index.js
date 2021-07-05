import React from 'react';
import {withRouter} from 'react-router-dom';
import './styles.less';
import GrafanaDashboard from '../../components/GrafanaDashboard';

const GoogleCrUx = ({selectedBrands, availableBrands}) => {
    return (
        <GrafanaDashboard
            selectedBrands={selectedBrands}
            availableBrands={availableBrands}
            name="google-crux"
            title="Google CrUx (RUM)"
            url="https://grafana.test.expedia.com/d/d0wMYdVZV/egperf_crux?theme=light&kiosk=tv&var-site=vrbo.com&var-scenario=Origin&var-formFactor=PHONE"
        />
    );
};

export default withRouter(GoogleCrUx);
