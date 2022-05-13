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

    useEffect(() => {
        const fetchCRs = () => {
            const brand = getBrand(selectedBrand, 'label');
            setIsLoading(true);
            setLastStartDate(startDate);
            setLastEndDate(endDate);
            const url = brand && brand.changeRequests ?
                `/change-requests-api/v1/changeDetails?from_date=${startDate}&to_date=${endDate}&brand=${brand.changeRequests}` :
                `/change-requests-api/v1/changeDetails?from_date=${startDate}&to_date=${endDate}`;
            fetch(url)
                .then(checkResponse)
                .then((data) => {
                    const filteredCR = brand && brand.changeRequests ? data.filter((x) => x.platform === brand.changeRequests) : data;
                    const crs = sortArrayByMostRecentDate(filteredCR, 'opened_at');
                    const uniqueCRs = getUniqueByProperty(crs, 'number');
                    const adjustedUniqueCRs = adjustCRsProperties(uniqueCRs);
                    const dataProducts = getListOfUniqueProperties(adjustedUniqueCRs, 'product_name');
                    const dataApplications = getListOfUniqueProperties(adjustedUniqueCRs, 'application_name');
                    const dataCRnumbers = getListOfUniqueProperties(adjustedUniqueCRs, 'number');
                    const dataPlatforms = getListOfUniqueProperties(adjustedUniqueCRs, 'platform');
                    const dataTeams = getListOfUniqueProperties(adjustedUniqueCRs, 'team');
                    const dataBusinessReasons = getListOfUniqueProperties(adjustedUniqueCRs, 'business_reason');
                    const dataStatuses = getListOfUniqueProperties(adjustedUniqueCRs, 'status');

                    setChangeRequestSuggestions({
                        product_name: dataProducts,
                        application_name: dataApplications,
                        platform: dataPlatforms,
                        business_reason: dataBusinessReasons,
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
                    console.error(err);
                });
        };

        if (!isLoading) {
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
    }, [isApplyClicked]);

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

    useEffect(() => {
        const fetchAbTestsAnnotations = () => {
            setAbTests([]);
            setIsLoading(true);
            setLastStartDate(startDate);
            setLastEndDate(endDate);

            const dateQuery = startDate && endDate
                ? `?from_datetime=${moment(startDate).utc().format()}&to_datetime=${moment(endDate).utc().format()}`
                : '';

            fetch(`/abTests${dateQuery}`)
                .then(checkResponse)
                .then((data) => {
                    const adjustedAbTests = data.map((abTest) => ({
                        ...abTest,
                        status: abTest.ab_test_details.status
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
                    console.error(err);
                });
        };

        if (!isLoading) {
            fetchAbTestsAnnotations();
        } else if (isApplyClicked) {
            if (lastStartDate !== startDate || lastEndDate !== endDate) {
                fetchAbTestsAnnotations();
            }
        }
    }, [isApplyClicked]);

    return [
        isLoading,
        error,
        abTests,
        abTestSuggestions
    ];
};
