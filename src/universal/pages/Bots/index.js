import React from 'react';
import {withRouter} from 'react-router-dom';
import './styles.less';
import GrafanaDashboard from '../../components/GrafanaDashboard';

const Bots = ({selectedBrands, availableBrands}) => {
    return (
        <GrafanaDashboard
            selectedBrands={selectedBrands}
            availableBrands={availableBrands}
            title="Bots"
            name="bots"
            url="https://opexhub-grafana.expedia.biz/d/ynLVZu1Mk/bots?orgId=1&refresh=5s&from=now-7d&to=now&theme=light"
        />
    );
};

export default withRouter(Bots);
