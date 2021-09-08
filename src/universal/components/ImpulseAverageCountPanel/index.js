import React from 'react';
import LoadingContainer from '../LoadingContainer';
import HelpText from '../HelpText/HelpText';
import './styles.less';
import PropTypes from 'prop-types';


const ImpulseAverageCountPanel = ({data, activeIndex, isLoading}) => {
    let selectedData;
    let selectedIndex;
    switch (activeIndex) {
        case 0:
            selectedData = 'overall';
            selectedIndex = 2;
            break;
        case 1:
            selectedData = 'brands';
            selectedIndex = 1;
            break;
        case 2:
            selectedData = 'lobs';
            selectedIndex = 0;
            break;
        default:
            selectedData = 'overall';
            selectedIndex = 2;
            break;
    }

    const setError = () => (!isLoading && !data ? 'NO DATA AVAILABLE' : false);

    const renderPanelData = (periodData) => {
        if (Array.isArray(periodData)) {
            if (typeof periodData[selectedIndex][selectedData] === 'object') {
                return Object.entries(periodData[selectedIndex][selectedData]).map(([key, value]) => (<div className="percentage-change">{`${key}: ${value}%`}</div>));
            }
            return <div className="percentage-change big">{`${selectedData}: ${periodData[selectedIndex][selectedData]}%`}</div>;
        }
        return <div className="percentage-change big">{'TBA'}</div>;
    };

    const renderPanel = ([period, periodData]) => (
        <div key={`percentage-change-${period}`} className="card percentage-change-card">
            <div className="percentage-change-label">{period}</div>
            {renderPanelData(periodData)}
        </div>
    );

    return (
        <div className="summary-container">
            <h3>
                {'Percentage Change'}
                <HelpText className="percentage-change-info" text={'Booking trends change in percentage'} placement="top"/>
            </h3>
            <LoadingContainer isLoading={isLoading} error={setError()} className="percentage-loading-container">
                <div className="percentage-change-card-container">
                    {Object.entries(data).map(renderPanel)}
                </div>
            </LoadingContainer>
        </div>
    );
};

ImpulseAverageCountPanel.propTypes = {
    data: PropTypes.shape(),
    activeIndex: PropTypes.number,
    isLoading: PropTypes.bool.isRequired,
};

export default ImpulseAverageCountPanel;
