import React, {useEffect, useState} from 'react';
import {useLocation, withRouter} from 'react-router-dom';
import moment from 'moment';
import {DatetimeRangePicker} from '../../components/DatetimeRangePicker';
import {getQueryValues, checkResponse} from '../utils';
import {DATE_FORMAT} from '../../constants';
import MultiSelect from '@homeaway/react-multiselect-dropdown';
import PieChart from '../../components/PieChart';
import LoadingContainer from '../../components/LoadingContainer';
import {labelFormat, formatPieData} from './utils';

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
    const [displayError, setDisplayError] = useState('');
    const [data, setData] = useState([]);

    const applyFilters = () => {
        setIsLoading(true);
        setFrom(pendingFrom);
        setTo(pendingTo);
        setTeams(pendingTeams);
        setIsDirtyForm(false);
    };


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

    useEffect(() => {
        setIsLoading(true);
        fetch('/v1/score-card/teams')
            .then(checkResponse)
            .then((teamResponse) => setTeams(teamResponse?.map((x) => ({name: x, label: x}))))
            .catch(() => setDisplayError('Error loading the teams. Try refreshing the page'))
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        const selectedTeam = teams.filter((x) => x?.checked && x?.name).map((x) => x?.name);
        const url = `/v1/score-card/distribution-work-data?from_date=${moment(from).format('YYYY-MM-DDTHH:mm:ss.sss[Z]')}&to_date=${moment(to).format('YYYY-MM-DDTHH:mm:ss.sss[Z]')}&team_name=${selectedTeam}`;
        fetch(url)
            .then(checkResponse)
            .then((res) => setData(res))
            .catch(() => setDisplayError('Error loading the distribution of work. Try refreshing the page'))
            .finally(() => setIsLoading(false));
    }, [from, to, teams]);


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
        <div className="agile-scorecard-container">
            <h1 className="page-title" data-testid="title">{'Agile ScoreCard'}</h1>
            {renderFilters()}
            <LoadingContainer
                isLoading={isLoading}
                error={displayError}
            >
                <PieChart
                    data={formatPieData(data)}
                    title="Distribution of Work"
                />
            </LoadingContainer>
        </div>
    );
};

export default withRouter(AgileScorecard);
