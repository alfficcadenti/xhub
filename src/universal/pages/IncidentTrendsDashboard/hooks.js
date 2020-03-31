import {useState, useEffect, useRef} from 'react';
import {adjustTicketProperties, getListOfUniqueProperties, getUniqueTickets} from './incidentsHelper';
import {ALL_PRIORITIES_OPTION} from './constants';


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
    seCurrentPriorities
) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [allUniqueIncidents, setAllUniqueIncidents] = useState([]);
    const [allIncidents, setAllIncidents] = useState([]);
    const [allUniqueDefects, setAllUniqueDefects] = useState([]);
    const [allDefects, setAllDefects] = useState([]);
    const [lastStartDate, setLastStartDate] = useState('');
    const [lastEndDate, setLastEndDate] = useState('');

    const [incidentsPriorities, setIncidentsPriorities] = useState([]);
    const [defectsPriorities, setDefectsPriorities] = useState([]);

    const [incidentsStatuses, setIncidentsStatuses] = useState([]);
    const [defectsStatuses, setDefectsStatuses] = useState([]);

    const isMount = useIsMount();

    useEffect(() => {
        const fetchTickets = () => {
            setIsLoading(true);
            setLastStartDate(startDate);
            setLastEndDate(endDate);

            Promise.all([fetch(`/api/v1/incidents?startDate=${startDate}&endDate=${endDate}`), fetch(`/api/v1/defects?startDate=${startDate}&endDate=${endDate}`)])
                .then((responses) => Promise.all(responses.map((r) => r.json())))
                .then(([incidents, defects]) => {
                    // incidents
                    const uniqueIncidents = getUniqueTickets(incidents, 'incidentNumber');

                    const adjustedUniqueIncidents = adjustTicketProperties(uniqueIncidents, 'incident');
                    const incPriorities = getListOfUniqueProperties(adjustedUniqueIncidents, 'priority').sort();
                    const incStatuses = getListOfUniqueProperties(adjustedUniqueIncidents, 'Status');

                    setIncidentsPriorities([...incPriorities, ALL_PRIORITIES_OPTION]);
                    setIncidentsStatuses(incStatuses);

                    setAllUniqueIncidents(adjustedUniqueIncidents);
                    setAllIncidents(incidents);

                    // set priorities for default tab (currently it's an incidents tab (index 1))
                    seCurrentPriorities([...incPriorities, ALL_PRIORITIES_OPTION]);
                    // defects
                    const uniqueDefects = getUniqueTickets(defects, 'defectNumber');

                    const adjustedUniqueDefects = adjustTicketProperties(uniqueDefects, 'defect');
                    const defPriorities = getListOfUniqueProperties(adjustedUniqueDefects, 'priority').sort();
                    const defStatuses = getListOfUniqueProperties(adjustedUniqueDefects, 'Status');

                    setDefectsPriorities([...defPriorities, ALL_PRIORITIES_OPTION]);
                    setDefectsStatuses(defStatuses);

                    setAllUniqueDefects(adjustedUniqueDefects);
                    setAllDefects(defects);
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
        allUniqueIncidents,
        allIncidents,
        allUniqueDefects,
        allDefects,
        incidentsPriorities,
        defectsPriorities,
        incidentsStatuses,
        defectsStatuses,
    ];
};
