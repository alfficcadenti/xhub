import React from 'react';
import {withRouter} from 'react-router-dom';
import './styles.less';
import GrafanaDashboard from '../../components/GrafanaDashboard';

const ShoppingFencePostEvents = ({selectedBrands, availableBrands}) => {
    return (
        <GrafanaDashboard
            selectedBrands={selectedBrands}
            availableBrands={availableBrands}
            title="Fence Post Events - Shopping Journey"
            name="fence-post-events-shopping-journey"
            url="https://opexhub-grafana.expedia.biz/d/E1hJ9Cznk/opxhub-vrbo-shopping-journey-fence-post-events?orgId=1&theme=light"
        />
    );
};

export default withRouter(ShoppingFencePostEvents);
