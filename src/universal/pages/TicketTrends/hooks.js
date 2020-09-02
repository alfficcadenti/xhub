import {useState, useEffect} from 'react';
import {adjustTicketProperties, impactedBrandToDivision} from './incidentsHelper';
import {
    ALL_PRIORITIES_OPTION,
    ALL_STATUSES_OPTION,
    ALL_TAGS_OPTION,
    ALL_TAGS,
    EG_BRAND,
    EXPEDIA_PARTNER_SERVICES_BRAND,
    ALL_PARTNERS_OPTION,
    ALL_RC_OWNERS_OPTION
} from '../../constants';
import {useIsMount} from '../hooks';
import {checkResponse, getListOfUniqueProperties, consolidateTicketsById, sortArrayByMostRecentDate, mapEpsData} from '../utils';


export const useFetchTickets = (
    isApplyClicked,
    startDate,
    endDate,
    applyFilters,
    setIsApplyClicked,
    url,
    selectedBrand
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
    const [partners, setPartners] = useState([]);

    const isMount = useIsMount();

    const isIncidents = url === 'incidents';

    useEffect(() => {
        const fetchTickets = () => {
            setIsLoading(true);
            setLastStartDate(startDate);
            setLastEndDate(endDate);
            const paths = [`/v1/${url}?fromDate=${startDate}&toDate=${endDate}`];
            if (selectedBrand === EXPEDIA_PARTNER_SERVICES_BRAND && isIncidents) {
                paths.push(`https://opxhub-data-service.us-west-2.test.expedia.com/v1/eps/${url}?fromDate=${startDate}&toDate=${endDate}`);
            }
            const handleFetchError = (err) => {
                // eslint-disable-next-line no-console
                console.error(JSON.stringify(err, null, 4));
                setIsLoading(false);
                setError('Not all incidents and/or defects are available. Check your VPN or refresh the page to try again. If this problem persists, please message #dpi-reo-opex-all or fill out our Feedback form.');
            };
            Promise.all(paths.map((path) => fetch(path).catch(handleFetchError)))
                .then((responses) => Promise.all(responses.map(checkResponse)))
                .then(([ticketsData, epsTicketsData = []]) => {
                    const epsTickets = epsTicketsData.map(mapEpsData);
                    const tickets = (isIncidents)
                        ? sortArrayByMostRecentDate([...ticketsData, ...epsTickets], 'startDate')
                        : sortArrayByMostRecentDate([...ticketsData, ...epsTickets], 'openDate');
                    const uniqueTickets = consolidateTicketsById(tickets, 'id');
                    const adjustedUniqueTickets = adjustTicketProperties(uniqueTickets, isIncidents ? 'incident' : 'defect');
                    const ticketPriorities = getListOfUniqueProperties(adjustedUniqueTickets, 'priority').sort();
                    const ticketStatuses = getListOfUniqueProperties(adjustedUniqueTickets, 'Status');
                    const ticketPartners = getListOfUniqueProperties(adjustedUniqueTickets, 'impactedPartners');

                    setPriorities([ALL_PRIORITIES_OPTION, ...ticketPriorities]);
                    setStatuses([ALL_STATUSES_OPTION, ...ticketStatuses]);
                    setTags([ALL_TAGS_OPTION, ...ALL_TAGS]);
                    setPartners([ALL_PARTNERS_OPTION, ...ticketPartners]);

                    setAllUniqueTickets(adjustedUniqueTickets);
                    setAllTickets(tickets);
                    setIsLoading(false);
                }).catch((err) => {
                    // eslint-disable-next-line no-console
                    console.error(JSON.stringify(err, null, 4));
                    setIsLoading(false);
                    setError('Error occurred when reading tickets. Please try refreshing the page. If this problem persists, please message #dpi-reo-opex-all or fill out our Feedback form.');
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
        tags,
        partners
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
