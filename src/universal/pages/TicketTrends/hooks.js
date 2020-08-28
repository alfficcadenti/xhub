import {useState, useEffect} from 'react';
import {adjustTicketProperties, impactedBrandToDivision} from './incidentsHelper';
import {
    ALL_PRIORITIES_OPTION,
    ALL_STATUSES_OPTION,
    ALL_TAGS_OPTION,
    ALL_TAGS,
    EG_BRAND,
    ALL_RC_OWNERS_OPTION
} from '../../constants';
import {useIsMount} from '../hooks';
import {checkResponse, getListOfUniqueProperties, consolidateTicketsById, sortArrayByMostRecentDate} from '../utils';


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
            fetch(`/v1/${url}?fromDate=${startDate}&toDate=${endDate}`)
                .then(checkResponse)
                .then((data) => {
                    const isIncidents = url === 'incidents';
                    const tickets = (isIncidents)
                        ? sortArrayByMostRecentDate(data, 'startDate')
                        : sortArrayByMostRecentDate(data, 'openDate');
                    const uniqueTickets = consolidateTicketsById(tickets, 'id');
                    const adjustedUniqueTickets = adjustTicketProperties(uniqueTickets, isIncidents ? 'incident' : 'defect');
                    const ticketPriorities = getListOfUniqueProperties(adjustedUniqueTickets, 'priority').sort();
                    const ticketStatuses = getListOfUniqueProperties(adjustedUniqueTickets, 'Status');

                    setPriorities([ALL_PRIORITIES_OPTION, ...ticketPriorities]);
                    setStatuses([ALL_STATUSES_OPTION, ...ticketStatuses]);
                    setTags([ALL_TAGS_OPTION, ...ALL_TAGS]);

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

export const useRootCauseOwner = (selectedBrand, allUniqueIncidents) => {
    const [rootCauseOwners, setRootCauseOwners] = useState([]);
    useEffect(() => {
        const filteredIncidents = selectedBrand === EG_BRAND
            ? allUniqueIncidents
            : allUniqueIncidents.filter(
                ({impactedBrand}) => (impactedBrand && impactedBrand.split(',').some((iBrand) => (selectedBrand === impactedBrandToDivision(iBrand))))
            );
        const rcOwners = getListOfUniqueProperties(filteredIncidents, 'RC Owner');
        setRootCauseOwners([ALL_RC_OWNERS_OPTION, ...rcOwners]);
    }, [selectedBrand, allUniqueIncidents]);

    return rootCauseOwners;
};
