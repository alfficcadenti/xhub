import {useState, useEffect} from 'react';
import {adjustCRsProperties} from './crUtils';
import {useIsMount} from '../hooks';
import {getBrand, checkResponse, getUniqueByProperty, getListOfUniqueProperties, sortArrayByMostRecentDate} from '../utils';
import moment from 'moment';

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
    const isMount = useIsMount();

    const [productMapping, setProductMapping] = useState([]);


    useEffect(() => {
        const fetchProductMapping = () => {
            const dateQuery = startDate && endDate
                ? `startDate=${moment(startDate).utc().format()}&endDate=${moment(endDate).utc().format()}`
                : '';
            fetch(`/productMapping?${dateQuery}`)
                .then(checkResponse)
                .then((mapping) => {
                    setProductMapping(mapping);
                })
                .catch((err) => {
                    // eslint-disable-next-line no-console
                    console.error(err);
                });
        };
        fetchProductMapping();

        const fetchCRs = () => {
            console.log(getBrand(selectedBrand, 'label').changeRequests);
            const brand = getBrand(selectedBrand, 'label')
            setIsLoading(true);
            setLastStartDate(startDate);
            setLastEndDate(endDate);
            const url = brand && brand.changeRequests ? 
                `/change-requests-api/v1/changeDetails?startDate=${startDate}&endDate=${endDate}&platform=${brand.changeRequests}` :
                `/change-requests-api/v1/changeDetails?startDate=${startDate}&endDate=${endDate}`;
            fetch(url)
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

                    setIndexedDataForSuggestions({
                        'productName': dataProducts,
                        'applicationName': dataApplications,
                        'platform': dataPlatforms,
                        'businessReason': dataBusinessReasons,
                        'number': dataCRnumbers,
                        'status': dataStatuses,
                        'team': dataTeams,
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

        if (isMount && !isLoading) {
            fetchCRs();
        } else if (isApplyClicked) {
            if (lastStartDate !== startDate || lastEndDate !== endDate) {
                fetchCRs();
            } else {
                applyAdvancedFilter();
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
        indexedDataForSuggestions,
        productMapping
    ];
};
