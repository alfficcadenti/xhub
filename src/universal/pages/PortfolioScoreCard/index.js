import React, {useState} from 'react';
import {useLocation, withRouter} from 'react-router-dom';
import moment from 'moment';
import {DatetimeRangePicker} from '../../components/DatetimeRangePicker';
import {DATE_FORMAT} from '../../constants';
import ScoreCard from './ScoreCard';
import {useQueryParamChange, useSelectedBrand} from '../hooks';
import {getQueryValues} from './utils';
import './styles.less';


// eslint-disable-next-line complexity
const PortfolioScoreCard = ({selectedBrands, onBrandChange, prevSelectedBrand}) => {
    const {search} = useLocation();
    const {initialStart, initialEnd} = getQueryValues(search);
    const [startDate, setStartDate] = useState(initialStart);
    const [endDate, setEndDate] = useState(initialEnd);
    const [isDirtyForm, setIsDirtyForm] = useState(false);
    const [isApplyClicked, setIsApplyClicked] = useState(false);

    useQueryParamChange(selectedBrands[0], onBrandChange);
    useSelectedBrand(selectedBrands[0], onBrandChange, prevSelectedBrand);

    const handleDateRangeChange = ({start, end}) => {
        setStartDate(moment(start).format(DATE_FORMAT));

        if (!!end || (!end && moment(start).isAfter(endDate))) {
            setEndDate(moment(end).format(DATE_FORMAT));
        }

        setIsDirtyForm(true);
    };

    const renderFilters = () => {
        return (
            <div className="filters-wrapper">
                <DatetimeRangePicker
                    onChange={handleDateRangeChange}
                    startDate={moment(startDate).toDate()}
                    endDate={moment(endDate).toDate()}
                    hidePresets
                />
                <button
                    type="button"
                    className="apply-button btn btn-primary active"
                    onClick={() => {
                        setIsApplyClicked(true);
                    }}
                    disabled={!isDirtyForm}
                >
                    {'Apply'}
                </button>
            </div>
        );
    };

    return (
        <div className="portfolio-score-card-container">
            <h1 className="page-title">{'Portfolio ScoreCard'}</h1>
            {renderFilters()}
            <ScoreCard
                start={startDate}
                end={endDate}
                isApplyClicked={isApplyClicked}
                setIsApplyClicked={setIsApplyClicked}
            />
        </div>
    );
};

export default withRouter(PortfolioScoreCard);
