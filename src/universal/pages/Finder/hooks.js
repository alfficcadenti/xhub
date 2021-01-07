import {useState, useEffect} from 'react';
import {adjustCRsProperties} from './crUtils';
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

    const [changeRequestSuggestions, setChangeRequestSuggestions] = useState({});
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        const fetchCRs = () => {
            const brand = getBrand(selectedBrand, 'label');
            setIsLoading(true);
            setLastStartDate(startDate);
            setLastEndDate(endDate);
            const url = brand && brand.changeRequests ?
                `/change-requests-api/v1/changeDetails?startDate=${startDate}&endDate=${endDate}&brand=${brand.changeRequests}` :
                `/change-requests-api/v1/changeDetails?startDate=${startDate}&endDate=${endDate}`;
            fetch(url)
                .then(checkResponse)
                .then((data) => {
                    const filteredCR = brand && brand.changeRequests ? data.filter((x) => x.platform === brand.changeRequests) : data;
                    const crs = sortArrayByMostRecentDate(filteredCR, 'openedAt');
                    const uniqueCRs = getUniqueByProperty(crs, 'number');
                    const adjustedUniqueCRs = adjustCRsProperties(uniqueCRs);
                    const dataProducts = getListOfUniqueProperties(adjustedUniqueCRs, 'productName');
                    const dataApplications = getListOfUniqueProperties(adjustedUniqueCRs, 'applicationName');
                    const dataCRnumbers = getListOfUniqueProperties(adjustedUniqueCRs, 'number');
                    const dataPlatforms = getListOfUniqueProperties(adjustedUniqueCRs, 'platform');
                    const dataTeams = getListOfUniqueProperties(adjustedUniqueCRs, 'team');
                    const dataBusinessReasons = getListOfUniqueProperties(adjustedUniqueCRs, 'businessReason');
                    const dataStatuses = getListOfUniqueProperties(adjustedUniqueCRs, 'status');

                    setChangeRequestSuggestions({
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
        changeRequestSuggestions
    ];
};

export const useFetchABTests = (
    isApplyClicked,
    startDate,
    endDate
) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [abTests, setAbTests] = useState([]);

    const [lastStartDate, setLastStartDate] = useState('');
    const [lastEndDate, setLastEndDate] = useState('');

    const [abTestSuggestions, setAbTestSuggestions] = useState({});
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        const fetchAbTestsAnnotations = () => {
            setAbTests([]);
            setIsLoading(true);
            setLastStartDate(startDate);
            setLastEndDate(endDate);

            const dateQuery = startDate && endDate
                ? `?startDate=${moment(startDate).utc().format()}&endDate=${moment(endDate).utc().format()}`
                : '';

            fetch(`/abTests${dateQuery}`)
                .then(checkResponse)
                .then((data) => {
                    const adjustedAbTests = data.map((abTest) => ({
                        ...abTest,
                        status: abTest.abTestDetails.status
                    }));

                    const dataStatuses = getListOfUniqueProperties(adjustedAbTests, 'status');
                    setAbTestSuggestions({
                        status: dataStatuses
                    });
                    setAbTests(adjustedAbTests);
                    setIsLoading(false);
                })
                .catch((err) => {
                    setIsLoading(false);
                    setError('Not all A/B tests are available. Refresh the page to try again.');
                    // eslint-disable-next-line no-console
                    console.error(err);
                });
        };

        if (isMounted && !isLoading) {
            fetchAbTestsAnnotations();
        } else if (isApplyClicked) {
            if (lastStartDate !== startDate || lastEndDate !== endDate) {
                fetchAbTestsAnnotations();
            }
        }

        setIsMounted(true);
    }, [isApplyClicked, isMounted]);

    return [
        isLoading,
        error,
        abTests,
        abTestSuggestions
    ];
};
