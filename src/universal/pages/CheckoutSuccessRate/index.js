import React from 'react';
import {withRouter} from 'react-router-dom';
import Iframe from 'react-iframe';
import './styles.less';


const CheckoutSuccessRate = () => {
    return (
        <div className="checkout-success-rate-container">
            <h1 className="page-title">{'Checkout Success Rate'}</h1>
            <div className="checkout-success-rate">
                <Iframe
                    url="https://opexhub-grafana.expedia.biz/d/vv4YryEGz/csr?orgId=1&refresh=30s&var-LOCALE=All&var-MARKETINGCHANNEL=All&var-PLATFORM=All&var-POS=All&var-IsKES=All"
                    key={'iframe'}
                    width="1600px"
                    height="950px"
                    id="checkout-success-rate"
                    className="iframe"
                    position="relative"
                />
            </div>
        </div>
    );
};

export default withRouter(CheckoutSuccessRate);
