import React, {useEffect, useState} from 'react';
import {withRouter} from 'react-router-dom';
import Iframe from 'react-iframe';
import './styles.less';
import LoadingContainer from '../../components/LoadingContainer';
import {EG_BRAND, EXPEDIA_BRAND, EGENCIA_BRAND, OPXHUB_SUPPORT_CHANNEL, EXPEDIA_PARTNER_SERVICES_BRAND, VRBO_BRAND} from '../../constants';


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
        <div className="bots-container">
            <h1 className="page-title">{'Bots'}</h1>
            <LoadingContainer isLoading={false} error={error}>
                <div className="bots">
                    <Iframe
                        url="https://opexhub-grafana.expedia.biz/d/ynLVZu1Mk/bots?orgId=1&refresh=5s&from=now-7d&to=now"
                        key="iframe"
                        width="1600px"
                        height="950px"
                        id="bots"
                        className="iframe"
                        position="relative"
                    />
                </div>
            </LoadingContainer>
        </div>
    );
};

export default withRouter(Bots);
