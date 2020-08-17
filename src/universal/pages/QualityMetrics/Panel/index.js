import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@homeaway/react-tooltip';
import {SVGIcon} from '@homeaway/react-svg';
import {INFO__16} from '@homeaway/svg-defs';
import LoadingContainer from '../../../components/LoadingContainer';
import './styles.less';

const renderInfo = (info) => (
    <div className="tooltip-container">
        <Tooltip tooltipType="tooltip--lg" content={info}>
            <SVGIcon inlineFlex markup={INFO__16} />
        </Tooltip>
    </div>
);

const renderHeader = (title, info) => (
    title && <div className="tile-header"><h3>{title} {info && renderInfo(info)}</h3></div>
);

const Panel = ({
    title, isLoading, error, children, isFullWidth = false, isFixedHeight, info
}) => (
    <div className={`quality-panel ${isFullWidth ? 'full-width' : ''} ${isFixedHeight ? 'fixed-height' : ''}`}>
        <div className="chart-tile">
            {renderHeader(title, info)}
            <LoadingContainer isLoading={isLoading} error={error}>
                {!isLoading && children}
            </LoadingContainer>
        </div>
    </div>
);

Panel.defaultProps = {
    title: '',
    isLoading: false,
    error: null,
    children: null,
    width: 6,
    isFixedHeight: false,
    info: ''
};

Panel.propTypes = {
    title: PropTypes.string,
    isLoading: PropTypes.bool,
    error: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape()
    ]),
    children: PropTypes.node,
    width: PropTypes.number,
    isFixedHeight: PropTypes.bool,
    info: PropTypes.string
};

export default Panel;
