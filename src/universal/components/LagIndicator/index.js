import React from 'react';

import {
    EXPEDIA_BRAND,
    EXPEDIA_PARTNER_SERVICES_BRAND,
    HOTELS_COM_BRAND,
    VRBO_BRAND,
} from '../../constants';

export const selectAttributes = (selectedBrand) => {
    switch (selectedBrand) {
        case HOTELS_COM_BRAND:
            return {token: '8883f4260fb4215683ac747fc140759431ec372c9a22c39d55af9aab56ac306c', title: 'Onestream Lag'};
        case EXPEDIA_PARTNER_SERVICES_BRAND:
            return {token: '1865fed42a02636eb6baa6448ad4671b76604611347794e00d815163a79a18f0', title: 'UISPrime Lag'};
        case EXPEDIA_BRAND:
            return {token: '1865fed42a02636eb6baa6448ad4671b76604611347794e00d815163a79a18f0', title: 'UISPrime Lag'};
        case VRBO_BRAND:
            return {token: 'e59ee51979dd7e1f62453c06cf9f1b34e707cffd6e6ce1d053b6d99ae90896ed', title: 'Vrbo Lag'};
        default:
            return {token: null, title: null};
    }
};

const LagIndicator = ({selectedBrand}) => {
    const {token, title} = selectAttributes(selectedBrand);

    if (token && title) {
        return (
            <div className="lag-indicator">
                <iframe src={`https://app.datadoghq.com/graph/embed?token=${token}&height=100&width=200&legend=false"`} width="200" height="100" frameBorder="0" title={title}/>
            </div>
        );
    }
    return null;
};

export default React.memo(LagIndicator);