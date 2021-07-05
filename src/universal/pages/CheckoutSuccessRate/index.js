import React from 'react';
import {withRouter} from 'react-router-dom';
import './styles.less';
import GrafanaDashboard from '../../components/GrafanaDashboard';


const CheckoutSuccessRate = ({selectedBrands, availableBrands}) => {
    return (
        <GrafanaDashboard
            selectedBrands={selectedBrands}
            availableBrands={availableBrands}
            name="checkout-success-rate"
            title="Checkout Success Rate"
            url="https://opexhub-grafana.expedia.biz/d/vv4YryEGz/csr?orgId=1&refresh=30s&var-LOCALE=All&var-MARKETINGCHANNEL=All&var-PLATFORM=All&var-POS=All&var-IsKES=All&theme=light"
        />
    );
};

export default withRouter(CheckoutSuccessRate);
