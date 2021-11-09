import React, {useEffect, useState} from 'react';
import LoadingContainer from '../LoadingContainer';
import Iframe from 'react-iframe';
import './styles.less';
import PropTypes from 'prop-types';
import {OPXHUB_SUPPORT_CHANNEL} from '../../constants';

const GrafanaDashboard = ({selectedBrands = [], availableBrands = [], name, title, url}) => {
    const selectedBrand = selectedBrands[0];
    const [error, setError] = useState(null);

    useEffect(() => {
        if (selectedBrand && !availableBrands.includes(selectedBrand)) {
            setError(`${title} for ${selectedBrand} is not yet available.
                The following brands are supported at this time: "${availableBrands.map((brand) => brand)}".
                If you have any questions, please ping ${OPXHUB_SUPPORT_CHANNEL} or leave a comment via our Feedback form.`);
        } else {
            setError(null);
        }
    }, [selectedBrand, availableBrands]);

    return (
        <div className={`${name}-container grafana-container`}>
            {title && <h1 className="page-title">{`${title} Dashboard`}</h1>}
            <LoadingContainer isLoading={false} error={error}>
                <div className="grafana-navigation-blocker" />
                <div className="grafana-navigation-blocker grafana-navigation-blocker__vertical" />
                <div className={`${name}-dashboard`}>
                    <Iframe
                        url={url}
                        key="iframe"
                        width="1600px"
                        height="950px"
                        id={`${name}-dashboard`}
                        className="iframe"
                        position="relative"
                    />
                </div>
            </LoadingContainer>
        </div>
    );
};

GrafanaDashboard.propTypes = {
    error: PropTypes.string,
    name: PropTypes.string,
    title: PropTypes.string,
    url: PropTypes.string,
};

export default React.memo(GrafanaDashboard);