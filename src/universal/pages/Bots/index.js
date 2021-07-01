import React, {useEffect, useState} from 'react';
import {withRouter} from 'react-router-dom';
import './styles.less';
import {EG_BRAND, EXPEDIA_BRAND, EGENCIA_BRAND, OPXHUB_SUPPORT_CHANNEL, EXPEDIA_PARTNER_SERVICES_BRAND, VRBO_BRAND} from '../../constants';
import GrafanaDashboard from '../../components/GrafanaDashboard';

const Bots = ({selectedBrands}) => {
    const selectedBrand = selectedBrands[0];
    const [error, setError] = useState(null);

    useEffect(() => {
        if ([EG_BRAND, EXPEDIA_BRAND, EGENCIA_BRAND, VRBO_BRAND, EXPEDIA_PARTNER_SERVICES_BRAND].includes(selectedBrand)) {
            setError(`Bots for ${selectedBrand} is not yet available.
                The following brands are supported at this time: "Hotels.com Retail".
                If you have any questions, please ping ${OPXHUB_SUPPORT_CHANNEL} or leave a comment via our Feedback form.`);
        } else {
            setError(null);
        }
    }, [selectedBrand]);

    return (
        <GrafanaDashboard
            error={error}
            title="Bots"
            name="bots"
            url="https://opexhub-grafana.expedia.biz/d/ynLVZu1Mk/bots?orgId=1&refresh=5s&from=now-7d&to=now&theme=light"
        />
    );
};

export default withRouter(Bots);
