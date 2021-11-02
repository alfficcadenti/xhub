import React, {useState} from 'react';
import {useLocation, withRouter} from 'react-router-dom';
import moment from 'moment';
import {DatetimeRangePicker} from '../../components/DatetimeRangePicker';
import {DATE_FORMAT} from '../../constants';
import ScoreCard from './ScoreCard';
import {useQueryParamChange, useSelectedBrand} from '../hooks';
import {getQueryValues} from './utils';
import './styles.less';


const PortfolioScoreCard = ({selectedBrands, onBrandChange, prevSelectedBrand}) => {
    const {search} = useLocation();
    const {initialStart, initialEnd} = getQueryValues(search);

    const [from, setFrom] = useState(initialStart);
    const [to, setTo] = useState(initialEnd);
    const [pendingFrom, setPendingFrom] = useState(initialStart);
    const [pendingTo, setPendingTo] = useState(initialEnd);
    const [isDirtyForm, setIsDirtyForm] = useState(false);

    useQueryParamChange(onBrandChange);
    useSelectedBrand(selectedBrands[0], prevSelectedBrand);

    const applyFilters = () => {
        setFrom(pendingFrom);
        setTo(pendingTo);
        setIsDirtyForm(false);
    };

    const handleDateRangeChange = ({start, end}) => {
        const nextPendingFrom = moment(start).format(DATE_FORMAT);
        setPendingFrom(nextPendingFrom);
        setPendingTo(moment(end).format(DATE_FORMAT));
        setIsDirtyForm(true);
    };

    const renderFilters = () => {
        return (
            <div className="filters-wrapper">
                <DatetimeRangePicker
                    onChange={handleDateRangeChange}
                    startDate={moment(pendingFrom).toDate()}
                    endDate={moment(pendingTo).toDate()}
                    hidePresets
                />
                <button
                    type="button"
                    className="apply-button btn btn-primary active"
                    onClick={applyFilters}
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
            <ScoreCard start={from} end={to} selectedBrand={selectedBrands[0]} />
        </div>
    );
};

export default withRouter(PortfolioScoreCard);
