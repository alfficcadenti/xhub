/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import LoadingContainer from '../LoadingContainer';
import HelpText from '../HelpText/HelpText';
import './styles.less';


const RealTimeSummaryPanel = ({realTimeTotals, isRttLoading, rttError, tooltipLabel, label, showPercentageSign = false}) => {
    const renderRealTimeTotal = ([rttLabel, value]) => (
        <div key={`rtt-${rttLabel}`} className="card real-time-card">
            <div className="rtt-label">{rttLabel}</div>
            <div className="rtt-value">{`${value}${showPercentageSign ? '%' : ''}`}</div>
        </div>
    );

    return (
        <div className="summary-container">
            <h3>
                {label}
                <HelpText className="rtt-info" text={tooltipLabel} placement="top"/>
            </h3>
            <LoadingContainer isLoading={isRttLoading} error={rttError} className="rtt-loading-container">
                <div className="real-time-card-container">
                    {Object.entries(realTimeTotals).map(renderRealTimeTotal)}
                </div>
            </LoadingContainer>
        </div>
    );
};

export default RealTimeSummaryPanel;
