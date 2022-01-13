import React, {useEffect, useState} from 'react';
import {useLocation, withRouter} from 'react-router-dom';
import moment from 'moment';
import {DatetimeRangePicker} from '../../components/DatetimeRangePicker';
import {getQueryValues, checkResponse} from '../utils';
import {DATE_FORMAT} from '../../constants';
import MultiSelect from '@homeaway/react-multiselect-dropdown';
import {Navigation} from '@homeaway/react-navigation';
import LoadingContainer from '../../components/LoadingContainer';
import Distribution from './tabs/Distribution';
import NumberOfBugs from './tabs/NumberOfBugs';
import LeadTimes from './tabs/LeadTimes';
import {labelFormat} from './utils';
import {NAV_LINKS} from './constants';
import './styles.less';


import './styles.less';

const AgileScorecard = () => {
    const {search} = useLocation();
    const {initialStart, initialEnd, initialTeams} = getQueryValues(search);
    const [from, setFrom] = useState(initialStart);
    const [to, setTo] = useState(initialEnd);
    const [teams, setTeams] = useState(initialTeams || []);
    const [pendingFrom, setPendingFrom] = useState(initialStart);
    const [pendingTo, setPendingTo] = useState(initialEnd);
    const [pendingTeams, setPendingTeams] = useState(initialTeams || []);
    const [isDirtyForm, setIsDirtyForm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [activeIndex, setActiveIndex] = useState(0);

    function applyFilters() {
        setFrom(pendingFrom);
        setTo(pendingTo);
        setTeams(pendingTeams);
        setIsDirtyForm(false);
    }

    const handleDateRangeChange = ({start, end}) => {
        const nextPendingFrom = moment(start).format(DATE_FORMAT);
        setPendingFrom(nextPendingFrom);
        setPendingTo(moment(end).format(DATE_FORMAT));
        setIsDirtyForm(true);
    };

    const handleTeamChange = ({items}) => {
        setPendingTeams(items);
        setIsDirtyForm(true);
    };

    const handleNavigationClick = (_, index) => {
        setActiveIndex(index);
    };

    useEffect(() => {
        setIsLoading(true);
        setError();
        fetch('/v1/score-card/teams')
            .then(checkResponse)
            .then((teamResponse) => setTeams(teamResponse?.map((x) => ({name: x, label: x}))))
            .catch(() => setError('Error loading the teams. Try refreshing the page'))
            .finally(() => setIsLoading(false));
    }, []);

    const renderFilters = () => {
        return (
            <div className="filters-wrapper">
                <DatetimeRangePicker
                    onChange={handleDateRangeChange}
                    startDate={moment(pendingFrom).toDate()}
                    endDate={moment(pendingTo).toDate()}
                    hidePresets
                />
                <MultiSelect
                    className="teams-select"
                    id="teams-select"
                    label="Teams"
                    labelFormat={labelFormat}
                    items={teams}
                    onChange={handleTeamChange}
                    disabled={!!error}
                    errorMsg={error}
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

    const renderTabs = () => {
        switch (activeIndex) {
            case 0:
                return <Distribution from={from} to={to} teams={teams} />;
            case 1:
                return <NumberOfBugs from={from} to={to} teams={teams} />;
            case 2:
                return <LeadTimes from={from} to={to} teams={teams} />;
            default:
                return <Distribution from={from} to={to} teams={teams} />;
        }
    };

    return (
        <div className="agile-scorecard-container">
            <h1 className="page-title" data-testid="title">{'Agile ScoreCard'}</h1>
            {renderFilters()}
            <Navigation
                noMobileSelect
                activeIndex={activeIndex}
                links={NAV_LINKS}
                onLinkClick={handleNavigationClick}
            />
            <LoadingContainer isLoading={isLoading}>
                {renderTabs()}
            </LoadingContainer>
        </div>
    );
};

export default withRouter(AgileScorecard);
