import React from 'react';
import PropTypes from 'prop-types';
import {LoadingOverlay} from '@homeaway/react-loading-overlay';
import {Alert} from '@homeaway/react-alerts';
import './styles.less';

class LoadingContainer extends React.PureComponent {
    render() {
        const {isLoading, error, children} = this.props;
        return ( <div className="loading-container">
                 {isLoading && !error && <LoadingOverlay />}
                 {error ? <Alert className="loading-alert" msg={error} dismissible /> : !isLoading && children}
             </div>);
    }
}

LoadingContainer.defaultProps = {
    error: null,
    children: null
};

LoadingContainer.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    error: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape()
    ]),
    children: PropTypes.node
};

export default LoadingContainer;
