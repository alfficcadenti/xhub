import {useState, useEffect} from 'react';
import {adjustCRsProperties} from './crUtils';
import {getBrand, checkResponse, getUniqueByProperty, getListOfUniqueProperties, sortArrayByMostRecentDate} from '../utils';

export const useFetchCRs = (
    isApplyClicked,
    startDate,
    endDate,
    selectedBrand,
    applyAdvancedFilter,
    setIsApplyClicked
) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [allUniqueCRs, setAllUniqueCRs] = useState([]);
    const [allCRs, setAllCRs] = useState([]);

    const [lastStartDate, setLastStartDate] = useState('');
    const [lastEndDate, setLastEndDate] = useState('');

    const [indexedDataForSuggestions, setIndexedDataForSuggestions] = useState({});
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        const fetchCRs = () => {
            const brand = getBrand(selectedBrand, 'label');
            setIsLoading(true);
            setLastStartDate(startDate);
            setLastEndDate(endDate);
            const url = brand && brand.changeRequests ?
                `/change-requests-api/v1/changeDetails?startDate=${startDate}&endDate=${endDate}&platform=${brand.changeRequests}` :
                `/change-requests-api/v1/changeDetails?startDate=${startDate}&endDate=${endDate}`;
            fetch(url)
                .then(checkResponse)
                .then((data) => {
                    const filteredCR = brand && brand.changeRequests ? data.filter((x) => x.platform === brand.changeRequests) : data;
                    const crs = sortArrayByMostRecentDate(filteredCR, 'openedAt');
                    const uniqueCRs = getUniqueByProperty(crs, 'number');
                    const adjustedUniqueCRs = adjustCRsProperties(uniqueCRs);
                    const dataProducts = getListOfUniqueProperties(adjustedUniqueCRs, 'productName').sort();
                    const dataApplications = getListOfUniqueProperties(adjustedUniqueCRs, 'applicationName').sort();
                    const dataCRnumbers = getListOfUniqueProperties(adjustedUniqueCRs, 'number').sort();
                    const dataPlatforms = getListOfUniqueProperties(adjustedUniqueCRs, 'platform').sort();
                    const dataTeams = getListOfUniqueProperties(adjustedUniqueCRs, 'team').sort();
                    const dataBusinessReasons = getListOfUniqueProperties(adjustedUniqueCRs, 'businessReason').sort();
                    const dataStatuses = getListOfUniqueProperties(adjustedUniqueCRs, 'status').sort();

                    setIndexedDataForSuggestions({
                        productName: dataProducts,
                        applicationName: dataApplications,
                        platform: dataPlatforms,
                        businessReason: dataBusinessReasons,
                        number: dataCRnumbers,
                        status: dataStatuses,
                        team: dataTeams,
                    });
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

        if (isMounted && !isLoading) {
            fetchCRs();
        } else if (isApplyClicked) {
            if (lastStartDate !== startDate || lastEndDate !== endDate) {
                fetchCRs();
            } else {
                applyAdvancedFilter();
            }
        }
        setIsMounted(true);

        return () => {
            setIsApplyClicked(false);
        };
    }, [isApplyClicked, isMounted]);

    return [
        isLoading,
        error,
        allUniqueCRs,
        allCRs,
        indexedDataForSuggestions
    ];
};
