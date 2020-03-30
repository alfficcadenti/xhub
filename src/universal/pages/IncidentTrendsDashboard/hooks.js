import {useState, useEffect} from 'react';
import {adjustTicketProperties, getUniqueTickets} from './incidentsHelper';


export const useSetCovidTag = (setSelectedCovidTag) => {
    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        setSelectedCovidTag(query.get('covidFilter') === 'true');
    }, []);
};

export const useFetchTickets = (isApplyClicked, startDate, endDate) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [allUniqueIncidents, setAllUniqueIncidents] = useState([]);
    const [allIncidents, setAllIncidents] = useState([]);
    const [allUniqueDefects, setAllUniqueDefects] = useState([]);
    const [allDefects, setAllDefects] = useState([]);

    useEffect(() => {
        setIsLoading(true);

        Promise.all([fetch(`/api/v1/incidents?startDate=${startDate}&endDate=${endDate}`), fetch(`/api/v1/defects?startDate=${startDate}&endDate=${endDate}`)])
            .then((responses) => Promise.all(responses.map((r) => r.json())))
            .then(([incidents, defects]) => {
                // incidents
                const uniqueIncidents = getUniqueTickets(incidents, 'incidentNumber');
                setAllUniqueIncidents(adjustTicketProperties(uniqueIncidents, 'incident'));
                setAllIncidents(incidents);
                // defects
                const uniqueDefects = getUniqueTickets(defects, 'defectNumber');
                setAllUniqueDefects(adjustTicketProperties(uniqueDefects, 'defect'));
                setAllDefects(defects);
                setIsLoading(false);
            })
            .catch((err) => {
                setIsLoading(false);
                setError('Not all incidents and/or defects are available. Refresh the page to try again.');
                // eslint-disable-next-line no-console
                console.error(err);
            });
    }, [isApplyClicked]);

    return [isLoading, error, allUniqueIncidents, allIncidents, allUniqueDefects, allDefects];
};
