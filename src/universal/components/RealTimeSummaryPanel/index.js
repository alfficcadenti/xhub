import React from 'react';
import LoadingContainer from '../LoadingContainer';
import HelpText from '../HelpText/HelpText';
import './styles.less';


const RealTimeSummaryPanel = ({realTimeTotals, isRttLoading, rttError, tooltipLabel, label}) => {
    const renderRealTimeTotal = ([rttLabel, value]) => {
        const showPercentageSign = (rttValue) => rttValue !== 'N/A';
        const renderLOBs = (lobData) => {
            return lobData.map((lob) => {
                return (
                    <div key={lob.label} className="rtt-lob-item">{`${lob.label} : ${lob.rate}${showPercentageSign(lob.rate) ? '%' : ''}`}</div>
                );
            });
        };

        return (
            <div key={`rtt-${rttLabel}`} className="card real-time-card">
                <div className="rtt-label">{rttLabel}</div>
                {
                    Array.isArray(value) ?
                        <div key={`lob-${rttLabel}`} className="rtt-lob-wrapper">{renderLOBs(value)}</div> :
                        (<div className="rtt-summed-value">{`${value}${showPercentageSign(value) ? '%' : ''}`}</div>)
                }

            </div>
        );
    };

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
