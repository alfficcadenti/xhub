import {useState, useEffect} from 'react';
import moment from 'moment';
import {checkResponse} from '../utils';


export const useFetchIssues = (
    startDate,
    endDate,
    isApplyClicked,
    setIsApplyClicked,
    applyFilters
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
        fetch(`/v1/robbie/notification-logs?fromDate=${startDate}&toDate=${endDate}`)
            .then(checkResponse)
            .then((data) => {
                setAllIssues(data);
                setIsLoading(false);
            })
            .catch((err) => {
                setIsLoading(false);
                setError('Could not retrieve all Robbie Notification Logs. Refresh the page to try again.');
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
