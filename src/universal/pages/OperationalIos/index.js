import React, {useEffect, useState} from 'react';
import {withRouter} from 'react-router-dom';
import './styles.less';
import {EG_BRAND, EXPEDIA_BRAND, EGENCIA_BRAND, OPXHUB_SUPPORT_CHANNEL, VRBO_BRAND, EXPEDIA_PARTNER_SERVICES_BRAND} from '../../constants';
import GrafanaDashboard from '../../components/GrafanaDashboard';

const OperationalIos = ({selectedBrands}) => {
    const selectedBrand = selectedBrands[0];
    const [error, setError] = useState(null);

    useEffect(() => {
        if ([EG_BRAND, EXPEDIA_BRAND, EGENCIA_BRAND, VRBO_BRAND, EXPEDIA_PARTNER_SERVICES_BRAND].includes(selectedBrand)) {
            setError(`Operational Dashboard for ${selectedBrand} is not yet available.
                The following brands are supported at this time: "Hotels.com Retail".
                If you have any questions, please ping ${OPXHUB_SUPPORT_CHANNEL} or leave a comment via our Feedback form.`);
        } else {
            setError(null);
        }
    }, [selectedBrand]);

    return (
        <GrafanaDashboard
            error={error}
            name="operational-ios"
            title="Operational iOS"
            url="https://opexhub-grafana.expedia.biz/d/pdNQAz_Mz/cortina-ios?orgId=1&refresh=30m&var-LOCALE=All&var-MARKETINGCHANNEL=All&var-PLATFORM=Mob%20::%20TabWeb&var-PLATFORM=Mob%20::%20Web&var-POS=All&var-IsKES=All&var-DATACENTER=aws.us-east-1.unknown&theme=light"
        />
    );
};

export default withRouter(OperationalIos);
