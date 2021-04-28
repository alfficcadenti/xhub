import React, {useEffect, useState} from 'react';
import {withRouter} from 'react-router-dom';
import Iframe from 'react-iframe';
import './styles.less';
import LoadingContainer from '../../components/LoadingContainer';
import {EG_BRAND, EXPEDIA_BRAND, EGENCIA_BRAND, OPXHUB_SUPPORT_CHANNEL, VRBO_BRAND, EXPEDIA_PARTNER_SERVICES_BRAND} from '../../constants';


const DataCenterTraffic = ({selectedBrands}) => {
    const selectedBrand = selectedBrands[0];
    const [error, setError] = useState(null);

    useEffect(() => {
        if ([EG_BRAND, EXPEDIA_BRAND, EGENCIA_BRAND, VRBO_BRAND, EXPEDIA_PARTNER_SERVICES_BRAND].includes(selectedBrand)) {
            setError(`Reservations for ${selectedBrand} is not yet available.
                The following brands are supported at this time: "Hotels.com Retail".
                If you have any questions, please ping ${OPXHUB_SUPPORT_CHANNEL} or leave a comment via our Feedback form.`);
        } else {
            setError(null);
        }
    }, [selectedBrand]);

    return (
        <div className="data-center-traffic-container">
            <h1 className="page-title">{'Data Center Traffic'}</h1>
            <LoadingContainer isLoading={false} error={error}>
                <div className="data-center-traffic">
                    <Iframe
                        // url="https://opexhub-grafana.expedia.biz/d/fze5hWwGz/data-center-traffic?orgId=1&var-PLATFORM=All&var-MARKETINGCHANNEL=All&var-POS=All&var-LOCALE=All&var-PAGE=All"
                        url="https://opexhub-grafana.expedia.biz/d/fze5hWwGz/data-center-traffic?orgId=1&refresh=30s&var-PLATFORM=All&var-MARKETINGCHANNEL=All&var-POS=All&var-LOCALE=All&var-PAGE=All"
                        // url="https://opexhub-grafana.expedia.biz/d/fze5hWwGz/data-center-traffic?orgId=1"
                        key="iframe"
                        width="1600px"
                        height="950px"
                        id="data-center-traffic"
                        className="iframe"
                        position="relative"
                    />
                </div>
            </LoadingContainer>
        </div>
    );
};

export default withRouter(DataCenterTraffic);
