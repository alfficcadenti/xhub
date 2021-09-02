import React from 'react';
import LoadingContainer from '../LoadingContainer';
import HelpText from '../HelpText/HelpText';
import './styles.less';


const ImpulseAverageCountPanel = ({data, activeIndex}) => {
    let selectedData;
    switch (activeIndex) {
        case 0:
            selectedData = 'overall';
            break;
        case 1:
            selectedData = 'brands';
            break;
        case 2:
            selectedData = 'lobs';
            break;
        default:
            selectedData = 'overall';
            break;
    }

    const renderPanelData = (periodData) => {
        if (periodData === 'N/A') {
            return <div className="percentage-change big">{'TBA'}</div>;
        } else if (typeof periodData[selectedData] === 'object') {
            return Object.entries(periodData[selectedData]).map(([key, value]) => (<div className="percentage-change">{`${key}: ${value}%`}</div>));
        }

        return <div className="percentage-change big">{`${selectedData}: ${periodData[selectedData]}%`}</div>;
    };

    const renderPanel = ([period, periodData]) => {
        return (
            <div key={`percentage-change-${period}`} className="card percentage-change-card">
                <div className="percentage-change-label">{period}</div>
                {renderPanelData(periodData)}
            </div>
        );
    };

    return (
        <div className="summary-container">
            <h3>
                {'Percentage Change'}
                <HelpText className="percentage-change-info" text={'tooltipLabel'} placement="top"/>
            </h3>
            <LoadingContainer isLoading={data ? false : true} error={!data ? 'No data' : null} className="percentage-loading-container">
                <div className="percentage-change-card-container">
                    {data && Object.entries(data).map(renderPanel)}
                </div>
            </LoadingContainer>
        </div>
    );
};

export default ImpulseAverageCountPanel;
