import React from 'react';
import {withRouter} from 'react-router-dom';
import './styles.less';
import GrafanaDashboard from '../../components/GrafanaDashboard';

const BookingRequests = ({selectedBrands, availableBrands}) => {
    return (
        <GrafanaDashboard
            selectedBrands={selectedBrands}
            availableBrands={availableBrands}
            title="Booking Requests"
            name="booking-requests"
            url="https://opex-grafana.expedia.biz/d/000000004/booking-request?orgId=2&theme=light"
        />
    );
};

export default withRouter(BookingRequests);
