import React from 'react';
import {withRouter} from 'react-router-dom';
import './styles.less';
import GrafanaDashboard from '../../components/GrafanaDashboard';

const DataCenterTraffic = ({selectedBrands, availableBrands}) => {
    return (
        <GrafanaDashboard
            selectedBrands={selectedBrands}
            availableBrands={availableBrands}
            name="data-center-traffic"
            title="Data Center Traffic"
            url="https://opexhub-grafana.expedia.biz/d/fze5hWwGz/data-center-traffic?orgId=1&refresh=30s&var-PLATFORM=All&var-MARKETINGCHANNEL=All&var-POS=All&var-LOCALE=All&var-PAGE=All&theme=light"
        />
    );
};

export default withRouter(DataCenterTraffic);
