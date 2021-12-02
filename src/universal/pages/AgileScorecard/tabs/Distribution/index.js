import React, {useState, useEffect} from 'react';
import moment from 'moment';
import PieChart from '../../../../components/PieChart';
import LoadingContainer from '../../../../components/LoadingContainer';
import {formatPieData} from '../../utils';
import {checkResponse} from '../../../utils';

const Distribution = ({teams, from, to}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState(false);
    const [error, setError] = useState();

    useEffect(() => {
        setIsLoading(true);
        const selectedTeam = teams.filter((x) => x?.checked && x?.name).map((x) => x?.name);
        const url = `/v1/score-card/distribution-work-data?from_date=${moment(from).format('YYYY-MM-DDTHH:mm:ss.sss[Z]')}&to_date=${moment(to).format('YYYY-MM-DDTHH:mm:ss.sss[Z]')}&team_names=${selectedTeam}`;
        fetch(url)
            .then(checkResponse)
            .then(setData)
            .catch(() => setError('Error loading the distribution of work. Try refreshing the page'))
            .finally(() => setIsLoading(false));
    }, [teams, from, to]);

    return (
        <LoadingContainer isLoading={isLoading} error={error}>
            <PieChart data={formatPieData(data)} title="" />
        </LoadingContainer>
    );
};

export default Distribution;