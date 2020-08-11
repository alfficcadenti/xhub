import {useState, useEffect} from 'react';
import {adjustCRsProperties} from './crUtils';
import {
    ALL_PRIORITIES_OPTION,
} from '../../constants';
import {
    ALL_PLATFORMS_OPTION,
    ALL_TEAMS_OPTION,
} from './constants';
import {useIsMount} from '../hooks';
import {checkResponse, getUniqueByProperty, getListOfUniqueProperties} from '../utils';

export const useFetchCRs = (
    isApplyClicked,
    startDate,
    endDate,
    applyFilters,
    setIsApplyClicked,
) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const [allUniqueCRs, setAllUniqueCRs] = useState([]);
    const [allCRs, setAllCRs] = useState([]);

    const [lastStartDate, setLastStartDate] = useState('');
    const [lastEndDate, setLastEndDate] = useState('');

    const [priorities, setPriorities] = useState([]);
    const [platforms, setPlatforms] = useState([]);
    const [teams, setTeams] = useState([]);

    const isMount = useIsMount();

    useEffect(() => {
        const fetchCRs = () => {
            setIsLoading(true);
            setLastStartDate(startDate);
            setLastEndDate(endDate);
            fetch(`/change-requests-api/v1/changeDetails?startDate=${startDate}&endDate=${endDate}`)
                .then(checkResponse)
                .then((data) => {
                    data.sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt));
                    const uniqueCRs = getUniqueByProperty(data, 'number');
                    const adjustedUniqueCRs = adjustCRsProperties(uniqueCRs);
                    const dataPriorities = getListOfUniqueProperties(adjustedUniqueCRs, 'priority').sort();
                    const dataPlatforms = getListOfUniqueProperties(adjustedUniqueCRs, 'platform').sort();
                    const dataTeam = getListOfUniqueProperties(adjustedUniqueCRs, 'team').sort();

                    setPriorities([ALL_PRIORITIES_OPTION, ...dataPriorities]);
                    setPlatforms([ALL_PLATFORMS_OPTION, ...dataPlatforms]);
                    setTeams([ALL_TEAMS_OPTION, ...dataTeam]);

                    setAllUniqueCRs(adjustedUniqueCRs);
                    setAllCRs(data);

                    setIsLoading(false);
                })
                .catch((err) => {
                    setIsLoading(false);
                    setError('Not all change requests are available. Refresh the page to try again.');
                    // eslint-disable-next-line no-console
                    console.error(err);
                });
        };

        if (isMount) {
            fetchCRs();
        } else if (isApplyClicked) {
            if (lastStartDate !== startDate || lastEndDate !== endDate) {
                fetchCRs();
            } else {
                applyFilters();
            }
        }

        return () => {
            setIsApplyClicked(false);
        };
    }, [isApplyClicked, startDate, endDate]);

    return [
        isLoading,
        error,
        allUniqueCRs,
        allCRs,
        priorities,
        platforms,
        teams
    ];
};
