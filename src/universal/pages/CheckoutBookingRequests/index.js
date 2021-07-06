import React from 'react';
import {withRouter} from 'react-router-dom';
import './styles.less';
import GrafanaDashboard from '../../components/GrafanaDashboard';

const CheckoutBookingRequests = ({selectedBrands, availableBrands}) => {
    return (
        <GrafanaDashboard
            selectedBrands={selectedBrands}
            availableBrands={availableBrands}
            title="Checkout and Booking Requests"
            name="checkout-and-booking-requests"
            url="https://opex-grafana.expedia.biz/d/bPMFqkAWkabc/checkout-and-booking-funnel?refresh=1m&orgId=2&theme=light"
        />
    );
};

export default withRouter(CheckoutBookingRequests);
