import React, {useEffect, useState} from 'react';
import {withRouter} from 'react-router-dom';
import './styles.less';
import {EG_BRAND, EXPEDIA_BRAND, EGENCIA_BRAND, OPXHUB_SUPPORT_CHANNEL, EXPEDIA_PARTNER_SERVICES_BRAND, HOTELS_COM_BRAND} from '../../constants';
import GrafanaDashboard from '../../components/GrafanaDashboard';

const FencePostEvents = ({selectedBrands}) => {
    const selectedBrand = selectedBrands[0];
    const [error, setError] = useState(null);

    useEffect(() => {
        if ([EG_BRAND, EXPEDIA_BRAND, EGENCIA_BRAND, HOTELS_COM_BRAND, EXPEDIA_PARTNER_SERVICES_BRAND].includes(selectedBrand)) {
            setError(`Fence Post Events - Booking Journey for ${selectedBrand} is not yet available.
                The following brands are supported at this time: "Vrbo Retail".
                If you have any questions, please ping ${OPXHUB_SUPPORT_CHANNEL} or leave a comment via our Feedback form.`);
        } else {
            setError(null);
        }
    }, [selectedBrand]);

    return (
        <GrafanaDashboard
            error={error}
            title="Fence Post Events - Booking Journey"
            name="fence-post-events-booking-journey"
            url="https://opexhub-grafana.expedia.biz/d/vBTIYV6Mz/opxhub-vrbo-booking-journey-fence-post-events&theme=light"
        />
    );
};

export default withRouter(FencePostEvents);
