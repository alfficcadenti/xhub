import React from 'react';
import {withRouter} from 'react-router-dom';
import './styles.less';
import GrafanaDashboard from '../../components/GrafanaDashboard';

const InitialBookings = ({selectedBrands, availableBrands}) => {
    return (
        <GrafanaDashboard
            selectedBrands={selectedBrands}
            availableBrands={availableBrands}
            title="Initial Bookings"
            name="initial-bookings"
            url="https://opex-grafana.expedia.biz/d/000000022/initial-bookings?refresh=30s&orgId=2&theme=light"
        />
    );
};

export default withRouter(InitialBookings);
