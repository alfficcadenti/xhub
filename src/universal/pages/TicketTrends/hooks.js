import {useState, useEffect} from 'react';
import moment from 'moment';
import {adjustTicketProperties, impactedBrandToDivision} from './incidentsHelper';
import {
    DATE_FORMAT,
    ALL_PRIORITIES_OPTION,
    ALL_STATUSES_OPTION,
    EG_BRAND,
    EXPEDIA_PARTNER_SERVICES_BRAND,
    ALL_PARTNERS_OPTION,
    ALL_RC_OWNERS_OPTION,
    FETCH_FAILED_MSG
} from '../../constants';
import {checkResponse, getListOfUniqueProperties, consolidateTicketsById, sortArrayByMostRecentDate, mapEpsData} from '../utils';


export const useFetchTickets = (
    isApplyClicked,
    startDate,
    endDate,
    applyFilters,
    setIsApplyClicked,
    url,
    selectedBrands
) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedBrand, setSelectedBrand] = useState();

    const [allUniqueTickets, setAllUniqueTickets] = useState([]);
    const [allTickets, setAllTickets] = useState([]);

    const [lastStartDate, setLastStartDate] = useState('');
    const [lastEndDate, setLastEndDate] = useState('');

    const [priorities, setPriorities] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [partners, setPartners] = useState([]);
    const isIncidents = url === 'incidents';
    const browserTimezone = moment.tz.guess();
    const queryParams = `from_datetime=${moment(startDate).tz(browserTimezone).toISOString()}&to_datetime=${moment(endDate).tz(browserTimezone).toISOString()}`;

    const fetchTickets = () => {
        setIsLoading(true);
        setLastStartDate(startDate);
        setLastEndDate(endDate);
        fetch(`/v1/${url}?${queryParams}`)
            .then(checkResponse)
            .then(async (ticketsData) => {
                let epsTickets = [];
                if ([EXPEDIA_PARTNER_SERVICES_BRAND, EG_BRAND].includes(selectedBrands[0]) && isIncidents) {
                    const epsTicketsData = await fetch(`https://opxhub-data-service.us-west-2.test.expedia.com/v1/eps/${url}?fromDate=${moment(startDate).format(DATE_FORMAT)}&toDate=${moment(endDate).format(DATE_FORMAT)}`)
                        .then(checkResponse)
                        .then((data) => data)
                        .catch(() => {
                            // eslint-disable-next-line no-console
                            console.error('Failed to fetch EPS data');
                            return [];
                        });
                    epsTickets = epsTicketsData.map(mapEpsData);
                }
                const sortBy = isIncidents ? 'start_date' : 'open_date';
                const tickets = sortArrayByMostRecentDate([...ticketsData, ...epsTickets], sortBy);
                const uniqueTickets = consolidateTicketsById(tickets);
                const adjustedUniqueTickets = adjustTicketProperties(uniqueTickets);
                const ticketPriorities = getListOfUniqueProperties(adjustedUniqueTickets, 'priority');
                const ticketStatuses = getListOfUniqueProperties(adjustedUniqueTickets, 'Status');
                const ticketPartners = getListOfUniqueProperties(adjustedUniqueTickets, 'impactedPartners');

                setPriorities([ALL_PRIORITIES_OPTION, ...ticketPriorities]);
                setStatuses([ALL_STATUSES_OPTION, ...ticketStatuses]);
                setPartners([ALL_PARTNERS_OPTION, ...ticketPartners]);

                setAllUniqueTickets(adjustedUniqueTickets);
                setAllTickets(tickets);
                setIsLoading(false);
            }).catch((err) => {
                // eslint-disable-next-line no-console
                console.error(JSON.stringify(err, null, 4));
                setIsLoading(false);
                setError(FETCH_FAILED_MSG);
            });
    };

    useEffect(() => {
        if (isApplyClicked) {
            if (lastStartDate !== startDate || lastEndDate !== endDate) {
                fetchTickets();
            } else {
                applyFilters();
            }
        }

        return () => {
            setIsApplyClicked(false);
        };
    }, [isApplyClicked]);

    useEffect(() => {
        if (selectedBrand !== selectedBrands[0]) {
            fetchTickets();
            setSelectedBrand(selectedBrands[0]);
        }
        applyFilters();
    }, [selectedBrands]);

    return [
        isLoading,
        error,
        allUniqueTickets,
        allTickets,
        priorities,
        statuses,
        partners
    ];
};

export const useRootCauseOwner = (selectedBrand, allUniqueIncidents) => {
    const [rootCauseOwners, setRootCauseOwners] = useState([]);
    useEffect(() => {
        const filteredIncidents = selectedBrand === EG_BRAND
            ? allUniqueIncidents
            : allUniqueIncidents.filter(
                ({impacted_brand: impactedBrand}) => (impactedBrand && impactedBrand.split(',').some((iBrand) => (selectedBrand === impactedBrandToDivision(iBrand))))
            );
        const rcOwners = getListOfUniqueProperties(filteredIncidents, 'RC Owner');
        setRootCauseOwners([ALL_RC_OWNERS_OPTION, ...rcOwners]);
    }, [selectedBrand, allUniqueIncidents]);

    return rootCauseOwners;
};
