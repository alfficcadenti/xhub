import React from 'react';
import LoadingContainer from '../LoadingContainer';
import PropTypes from 'prop-types';
import {FETCH_FAILED_MSG} from '../../constants';
import './styles.less';

const ImpulseAverageCountPanel = ({data, isLoading}) => {
    const setError = () => (!isLoading && !data ? FETCH_FAILED_MSG : false);
    return (
        <LoadingContainer isLoading={isLoading} error={setError()}>
            <div className="impulse-container-percentage-change">
                <div className="widget-card percentage-change-boundary percentage-change-container" >{data.selectedLobs} BOOKING TRENDS
                    <div className="percentage-change-container-text">
                        <p>Change Percentage: Monthly <span className="weekly-monthly-data-color">{data.weekly}%</span>; Weekly <span className="weekly-monthly-data-color">{data.monthly}%</span></p>
                    </div>
                </div>
            </div>
        </LoadingContainer>
    );
};

ImpulseAverageCountPanel.propTypes = {
    data: PropTypes.shape(),
    isLoading: PropTypes.bool.isRequired
};

export default ImpulseAverageCountPanel;
