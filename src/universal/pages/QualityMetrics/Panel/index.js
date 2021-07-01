import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@homeaway/react-tooltip';
import Modal from '@homeaway/react-modal';
import {SVGIcon} from '@homeaway/react-svg';
import {INFO__16} from '@homeaway/svg-defs';
import LoadingContainer from '../../../components/LoadingContainer';
import './styles.less';

const Panel = ({title, isLoading, error, children, isFullWidth = false, isFixedHeight, info, queries}) => {
    const [isInfoOpen, setIsInfoOpen] = useState(false);

    const handleOpenInfo = () => setIsInfoOpen(true);

    const handleCloseInfo = () => setIsInfoOpen(false);

    const renderInfo = () => (
        <div className="tooltip-container" role="button" tabIndex="0" onKeyDown={handleOpenInfo} onClick={handleOpenInfo}>
            <Tooltip tooltipType="tooltip--lg" content={info}>
                <SVGIcon inlineFlex markup={INFO__16} />
            </Tooltip>
        </div>
    );

    const renderInfoModal = () => (
        <Modal
            id="info-modal"
            className="info-modal"
            title={title}
            isOpen={isInfoOpen}
            onClose={handleCloseInfo}
        >
            {queries?.length
                ? <ul>{queries.map((q, i) => <li key={`q${i}`}>{q}</li>)}</ul>
                : 'Query data unavailable.'}
        </Modal>
    );

    return (
        <div className={`quality-panel ${isFullWidth ? 'full-width' : ''} ${isFixedHeight ? 'fixed-height' : ''}`}>
            <div className="chart-tile">
                <div className="tile-header"><h3>{title} {info && renderInfo()}</h3></div>
                <LoadingContainer isLoading={isLoading} error={error}>
                    {!isLoading && children}
                </LoadingContainer>
            </div>
            {renderInfoModal()}
        </div>
    );
};

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
