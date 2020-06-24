import {useState, useEffect, useRef} from 'react';
import {adjustTicketProperties, getListOfUniqueProperties, getUniqueTickets} from './incidentsHelper';
import {ALL_PRIORITIES_OPTION, ALL_STATUSES_OPTION, ALL_TAGS_OPTION} from '../constants';


export const useSetCovidTag = (setSelectedCovidTag) => {
    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        setSelectedCovidTag(query.get('covidFilter') === 'true');
    }, []);
};

export const useIsMount = () => {
    const isMountRef = useRef(true);

    useEffect(() => {
        isMountRef.current = false;
    }, []);

    return isMountRef.current;
};

export const useFetchTickets = (
    isApplyClicked,
    startDate,
    endDate,
    applyFilters,
    setIsApplyClicked,
    url
) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const [allUniqueTickets, setAllUniqueTickets] = useState([]);
    const [allTickets, setAllTickets] = useState([]);

    const [lastStartDate, setLastStartDate] = useState('');
    const [lastEndDate, setLastEndDate] = useState('');

    const [priorities, setPriorities] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [tags, setTags] = useState([]);

    const isMount = useIsMount();

    useEffect(() => {
        const fetchTickets = () => {
            setIsLoading(true);
            setLastStartDate(startDate);
            setLastEndDate(endDate);

            fetch(`https://opxhub-service.us-west-2.test.expedia.com/api/v1/${url}?startDate=${startDate}&endDate=${endDate}`)
                .then((response) => response.json())
                .then((tickets) => {
                    // incidents
                    const isIncidents = url === 'incidents';
                    const uniqueTickets = getUniqueTickets(tickets, isIncidents ? 'incidentNumber' : 'defectNumber');

                    const adjustedUniqueTickets = adjustTicketProperties(uniqueTickets, isIncidents ? 'incident' : 'defect');
                    const ticketPriorities = getListOfUniqueProperties(adjustedUniqueTickets, 'priority').sort();
                    const ticketStatuses = getListOfUniqueProperties(adjustedUniqueTickets, 'Status');
                    const ticketTags = getListOfUniqueProperties(adjustedUniqueTickets, 'tag');

                    setPriorities([ALL_PRIORITIES_OPTION, ...ticketPriorities]);
                    setStatuses([ALL_STATUSES_OPTION, ...ticketStatuses]);
                    setTags([ALL_TAGS_OPTION, ...ticketTags]);

                    setAllUniqueTickets(adjustedUniqueTickets);
                    setAllTickets(tickets);

                    setIsLoading(false);
                })
                .catch((err) => {
                    setIsLoading(false);
                    setError('Not all incidents and/or defects are available. Refresh the page to try again.');
                    // eslint-disable-next-line no-console
                    console.error(err);
                });
        };

        if (isMount) {
            fetchTickets();
        } else if (isApplyClicked) {
            if (lastStartDate !== startDate || lastEndDate !== endDate) {
                fetchTickets();
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
        allUniqueTickets,
        allTickets,
        priorities,
        statuses,
        tags
    ];
};
