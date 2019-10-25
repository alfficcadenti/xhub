import React from 'react';
import PropTypes from 'prop-types';
import {LoadingOverlay} from '@homeaway/react-loading-overlay';
import './styles.less';

class LoadingContainer extends React.PureComponent {
    render() {
        const {isLoading, error, children} = this.props;
        return ( <div className="loading-container">
                 {isLoading && !error && <LoadingOverlay />}
                 {!isLoading && children}
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
