import React from 'react';
import './styles.less';

const CheckoutFCI = () => {
    return (
        <div className="checkout-fci-container">
            <h1>{'Checkout FCI'}</h1>
            <div className="grafana-navigation-blocker" />
            <div className="grafana-container">
                <iframe
                    id="id"
                    title="checkout-fci"
                    src="https://opexhub-grafana.expedia.biz/d/cWAVVRZMz/checkout-fci?theme=light"
                    height={1800}
                />
            </div>
        </div>
    );
};

export default CheckoutFCI;
