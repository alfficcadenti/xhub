import React from 'react';
import LoadingContainer from '../LoadingContainer';
import Iframe from 'react-iframe';
import './styles.less';
import PropTypes from 'prop-types';

const GrafanaDashboard = ({error = null, name, title, url}) => {
    return (
        <div className={`${name}-container`}>
            <h1 className="page-title">{`${title} Dashboard`}</h1>
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