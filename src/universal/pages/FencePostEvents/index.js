import React from 'react';
import {withRouter} from 'react-router-dom';
import './styles.less';
import GrafanaDashboard from '../../components/GrafanaDashboard';

const FencePostEvents = ({selectedBrands, availableBrands}) => {
    return (
        <GrafanaDashboard
            selectedBrands={selectedBrands}
            availableBrands={availableBrands}
            title="Fence Post Events - Booking Journey"
            name="fence-post-events-booking-journey"
            url="https://opexhub-grafana.expedia.biz/d/vBTIYV6Mz/opxhub-vrbo-booking-journey-fence-post-events&theme=light"
        />
    );
};

export default withRouter(FencePostEvents);
