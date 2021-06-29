/* eslint-disable no-unused-vars */
import {useState, useEffect} from 'react';
import moment from 'moment';
import {checkResponse, getListOfUniqueProperties} from '../utils';

export const useFetchIssues = (
    isApplyClicked,
    startDate,
    endDate,
    applyFilters,
    setIsApplyClicked,
    setCurrentProjects,
    setCurrentStatuses,
) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [allIssues, setAllIssues] = useState([]);
    const [lastStartDate, setLastStartDate] = useState();
    const [lastEndDate, setLastEndDate] = useState();

    const fetchIssues = () => {
        setIsLoading(true);
        setLastStartDate(startDate);
        setLastEndDate(endDate);
        fetch(`/v1/dog-food-data?fromDate=${startDate}&toDate=${endDate}`)
            .then(checkResponse)
            .then((data) => {
                setAllIssues(data);
                setCurrentProjects(getListOfUniqueProperties(data, 'project'));
                setCurrentStatuses(getListOfUniqueProperties(data, 'status'));
                setIsLoading(false);
            })
            .catch((err) => {
                setIsLoading(false);
                setError('Could not retrieve all Dog Food Issues. Refresh the page to try again.');
                // eslint-disable-next-line no-console
                console.error(err);
            });
    };

    useEffect(() => {
        fetchIssues();
    }, []);

    useEffect(() => {
        if (isApplyClicked) {
            if (!moment(startDate).isSame(lastStartDate) || !moment(endDate).isSame(lastEndDate)) {
                fetchIssues();
            } else {
                applyFilters();
            }
        }

        return () => {
            setIsApplyClicked(false);
        };
    }, [isApplyClicked]);

    return [
        isLoading,
        error,
        allIssues
    ];
};
