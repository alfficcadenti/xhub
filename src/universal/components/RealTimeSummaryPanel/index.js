/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import LoadingContainer from '../LoadingContainer';
import HelpText from '../HelpText/HelpText';
import './styles.less';


const RealTimeSummaryPanel = ({realTimeTotals, isRttLoading, rttError}) => {
    const renderRealTimeTotal = ([label, value]) => (
        <div key={`rtt-${label}`} className="card real-time-card">
            <div className="rtt-label">{label}</div>
            <div className="rtt-value">{value}</div>
        </div>
    );

    return (
        <div className="summary-container">
            <h3>
                {'Real Time Pageviews'}
                <HelpText className="rtt-info" text="Real time pageview totals within the last minute. Refreshes every minute." placement="top"/>
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
