import React from 'react';
import PropTypes from 'prop-types';
import {LoadingOverlay} from '@homeaway/react-loading-overlay';
import {Alert} from '@homeaway/react-alerts';
import './styles.less';

const LoadingContainer = ({isLoading, error, children, id, className = ''}) => {
    const errorMessage = typeof error === 'string' ? error : 'Error';

    const renderChildren = () => {
        return error ? <Alert className="loading-alert" msg={errorMessage} /> : !isLoading && children;
    };

    return (<div className={`loading-container ${className}`} id= {id}>
        {isLoading && !error && <LoadingOverlay />}
        {renderChildren()}
    </div>);
};

LoadingContainer.defaultProps = {
    error: null,
    children: null,
    id: null
};

LoadingContainer.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    error: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape()
    ]),
    id: PropTypes.string,
    children: PropTypes.node
};

export default LoadingContainer;
