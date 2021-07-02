import React from 'react';
import {withRouter} from 'react-router-dom';
import './styles.less';
import GrafanaDashboard from '../../components/GrafanaDashboard';

const OperationalTV = ({selectedBrands, availableBrands}) => {
    return (
        <GrafanaDashboard
            selectedBrands={selectedBrands}
            availableBrands={availableBrands}
            name="operational-tv"
            title="Operational TV"
            url="https://opexhub-grafana.expedia.biz/d/dlJmetPMk/cortina-tv?orgId=1&refresh=30s&var-LOCALE=All&var-MARKETINGCHANNEL=All&var-PLATFORM=All&var-POS=All&var-IsKES=All&theme=light"
        />
    );
};

export default withRouter(OperationalTV);
