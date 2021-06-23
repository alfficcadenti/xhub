/* eslint-disable no-unused-vars */
import {useState, useEffect} from 'react';
import moment from 'moment';
import {isNotEmptyString, isNotDuplicate, checkResponse, sortArrayByMostRecentDate} from '../utils';
import {mapTickets} from './utils';

const getListOfUniqueProperties = (tickets = [], prop) => tickets
    .map((ticket) => ticket[prop])
    .filter(isNotDuplicate)
    .filter(isNotEmptyString)
    .sort();

export const useFetchTickets = (
    isApplyClicked,
    startDate,
    endDate,
    applyFilters,
    setIsApplyClicked,
    setCurrentPriorities,
    setCurrentStatuses,
    setCurrentTypes,
    setCurrentOrgs,
    setCurrentRcOwners,
    setCurrentRcCategories
) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [allTickets, setAllTickets] = useState([]);
    const [lastStartDate, setLastStartDate] = useState();
    const [lastEndDate, setLastEndDate] = useState();

    const fetchTickets = () => {
        setIsLoading(true);
        setLastStartDate(startDate);
        setLastEndDate(endDate);
        // TODO: replace incidents API call with problem management tickets API call
        fetch(`/v1/prbs?fromDate=${startDate}&toDate=${endDate}`)
            .then(checkResponse)
            .then((data) => {
                const tickets = sortArrayByMostRecentDate(data, 'createdDate');
                // TODO: temporarily ignore data and replace with mockData
                setAllTickets(tickets.map(mapTickets));
                setCurrentOrgs(getListOfUniqueProperties(tickets, 'owningOrganization'));
                setCurrentRcOwners(getListOfUniqueProperties(tickets, 'rootCauseOwner'));
                setCurrentPriorities(getListOfUniqueProperties(tickets, 'priority'));
                setCurrentStatuses(getListOfUniqueProperties(tickets, 'status'));
                setCurrentRcCategories(getListOfUniqueProperties(tickets, 'rootCauseCategory'));
                setIsLoading(false);
            })
            .catch((err) => {
                setIsLoading(false);
                setError('Could not retrieve all problem management tickets. Refresh the page to try again.');
                // eslint-disable-next-line no-console
                console.error(err);
            });
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    useEffect(() => {
        if (isApplyClicked) {
            if (!moment(startDate).isSame(lastStartDate) || !moment(endDate).isSame(lastEndDate)) {
                fetchTickets();
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
        allTickets
    ];
};
