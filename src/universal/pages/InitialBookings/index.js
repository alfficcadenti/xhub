import React, {useEffect, useState} from 'react';
import {withRouter} from 'react-router-dom';
import './styles.less';
import {EG_BRAND, EXPEDIA_BRAND, EGENCIA_BRAND, OPXHUB_SUPPORT_CHANNEL, EXPEDIA_PARTNER_SERVICES_BRAND, HOTELS_COM_BRAND} from '../../constants';
import GrafanaDashboard from '../../components/GrafanaDashboard';

const InitialBookings = ({selectedBrands}) => {
    const selectedBrand = selectedBrands[0];
    const [error, setError] = useState(null);

    useEffect(() => {
        if ([EG_BRAND, EXPEDIA_BRAND, EGENCIA_BRAND, HOTELS_COM_BRAND, EXPEDIA_PARTNER_SERVICES_BRAND].includes(selectedBrand)) {
            setError(`Initial Bookings for ${selectedBrand} is not yet available.
                The following brands are supported at this time: "Vrbo Retail".
                If you have any questions, please ping ${OPXHUB_SUPPORT_CHANNEL} or leave a comment via our Feedback form.`);
        } else {
            setError(null);
        }
    }, [selectedBrand]);

    return (
        <GrafanaDashboard
            error={error}
            title="Initial Bookings"
            name="initial-bookings"
            url="https://opex-grafana.expedia.biz/d/000000022/initial-bookings?refresh=30s&orgId=2&theme=light"
        />
    );
};

export default withRouter(InitialBookings);
