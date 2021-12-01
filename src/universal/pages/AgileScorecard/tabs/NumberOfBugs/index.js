import React, {useState, useEffect} from 'react';
import moment from 'moment';
import LoadingContainer from '../../../../components/LoadingContainer';
import {formatLineChartData, formatTooltipData} from '../../utils';
import {checkResponse} from '../../../utils';
import LineChartWrapper from '../../../../components/LineChartWrapper';
import BugsModal from './BugsModal';
import {BUGS_TYPE_KEYS} from '../../constants';


const NumberOfBugs = ({teams, from, to}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState(false);
    const [error, setError] = useState();
    const [selectedDay, setSelectedDay] = useState();

    useEffect(() => {
        setIsLoading(true);
        const selectedTeam = teams.filter((x) => x?.checked && x?.name).map((x) => x?.name);
        const url = `/v1/score-card/number-of-bugs?from_date=${moment(from).format('YYYY-MM-DDTHH:mm:ss.sss[Z]')}&to_date=${moment(to).format('YYYY-MM-DDTHH:mm:ss.sss[Z]')}&team_name=${selectedTeam}`;
        fetch(url)
            .then(checkResponse)
            .then(setData)
            .catch(() => setError('Error loading the Number of Bugs. Try refreshing the page'))
            .finally(() => setIsLoading(false));
    }, [teams, from, to]);

    const handleDotClick = (selected) => selected?.payload?.name && setSelectedDay(selected.payload.name);

    const handleOnClose = () => setSelectedDay();

    return (
        <LoadingContainer
            isLoading={isLoading}
            error={error}
        >
            <LineChartWrapper
                title="Number of Bugs"
                data={formatLineChartData(data)}
                onDotClick={handleDotClick}
                keys={BUGS_TYPE_KEYS}
                helpText="Total number of Closed and Open bugs found in the period of interest"
            />
            <BugsModal
                dataObj={formatTooltipData(data)?.[selectedDay]}
                onClose={handleOnClose}
            />
        </LoadingContainer>);
};

export default NumberOfBugs;