import React from 'react';

import {
    EXPEDIA_BRAND,
    EXPEDIA_PARTNER_SERVICES_BRAND,
    HOTELS_COM_BRAND,
    VRBO_BRAND,
} from '../../constants';

const LagComponent = ({selectedBrand}) => {
    const hcomIframe = <iframe src="https://app.datadoghq.com/graph/embed?token=8883f4260fb4215683ac747fc140759431ec372c9a22c39d55af9aab56ac306c&height=100&width=200&legend=false" width="200" height="100" frameBorder="0" title="Onestream Lag"/>;
    const uisprimeIframe = <iframe src="https://app.datadoghq.com/graph/embed?token=1865fed42a02636eb6baa6448ad4671b76604611347794e00d815163a79a18f0&height=100&width=200&legend=false" width="200" height="100" frameBorder="0" title="Uisprime Lag" />;
    const vrboIframe = <iframe src="https://app.datadoghq.com/graph/embed?token=e59ee51979dd7e1f62453c06cf9f1b34e707cffd6e6ce1d053b6d99ae90896ed&height=100&width=200&legend=true" width="200" height="100" frameBorder="0" title="Vrbo Lag" />;

    switch (selectedBrand) {
        case HOTELS_COM_BRAND:
            return hcomIframe;
        case EXPEDIA_PARTNER_SERVICES_BRAND:
            return uisprimeIframe;
        case EXPEDIA_BRAND:
            return uisprimeIframe;
        case VRBO_BRAND:
            return vrboIframe;
        default:
            return null;
    }
};

export default React.memo(LagComponent);