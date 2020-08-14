import {useState, useEffect} from 'react';
import {adjustCRsProperties} from './crUtils';
import {
    ALL_PLATFORMS_OPTION,
    ALL_BUSINESS_REASONS_OPTION,
    ALL_STATUSES_OPTION
} from './constants';
import {useIsMount} from '../hooks';
import {checkResponse, getUniqueByProperty, getListOfUniqueProperties, sortArrayByMostRecentDate} from '../utils';

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

    const [indexedData, setIndexedData] = useState([]);
    const [platforms, setPlatforms] = useState([]);
    const [businessReasons, setBusinessReason] = useState([]);
    const [statuses, setStatuses] = useState([]);

    const isMount = useIsMount();

    useEffect(() => {
        const fetchCRs = () => {
            setIsLoading(true);
            setLastStartDate(startDate);
            setLastEndDate(endDate);
            fetch(`/change-requests-api/v1/changeDetails?startDate=${startDate}&endDate=${endDate}`)
                .then(checkResponse)
                .then((data) => {
                    const crs = sortArrayByMostRecentDate(data, 'openedAt');
                    const uniqueCRs = getUniqueByProperty(crs, 'number');
                    const adjustedUniqueCRs = adjustCRsProperties(uniqueCRs);
                    const dataProducts = getListOfUniqueProperties(adjustedUniqueCRs, 'productName').sort();
                    const dataApplications = getListOfUniqueProperties(adjustedUniqueCRs, 'applicationName').sort();
                    const dataCRnumbers = getListOfUniqueProperties(adjustedUniqueCRs, 'number').sort();
                    const dataPlatforms = getListOfUniqueProperties(adjustedUniqueCRs, 'platform').sort();
                    const dataTeams = getListOfUniqueProperties(adjustedUniqueCRs, 'team').sort();
                    const dataBusinessReasons = getListOfUniqueProperties(adjustedUniqueCRs, 'businessReason').sort();
                    const dataStatuses = getListOfUniqueProperties(adjustedUniqueCRs, 'status').sort();

                    setPlatforms([ALL_PLATFORMS_OPTION, ...dataPlatforms]);
                    setBusinessReason([ALL_BUSINESS_REASONS_OPTION, ...dataBusinessReasons]);
                    setStatuses([ALL_STATUSES_OPTION, ...dataStatuses]);
                    setIndexedData([...dataProducts, ...dataApplications, ...dataCRnumbers, ...dataTeams]);

                    setAllUniqueCRs(adjustedUniqueCRs);
                    setAllCRs(crs);

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
        indexedData,
        platforms,
        businessReasons,
        statuses
    ];
};
