import React from 'react';
import {withRouter} from 'react-router-dom';
import './styles.less';
import GrafanaDashboard from '../../components/GrafanaDashboard';

const OperationalDashboard = ({selectedBrands, availableBrands}) => {
    return (
        <GrafanaDashboard
            selectedBrands={selectedBrands}
            availableBrands={availableBrands}
            name="operational-dashboard"
            title="Operational Dashboard"
            url="https://opexhub-grafana.expedia.biz/d/LNYFUKEGz/cortina?orgId=1&refresh=30s&var-LOCALE=All&var-MARKETINGCHANNEL=All&var-PLATFORM=All&var-POS=All&var-IsKES=All&theme=light"
        />
    );
};

export default withRouter(OperationalDashboard);
