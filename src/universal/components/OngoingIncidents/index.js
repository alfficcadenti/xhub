/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, {Fragment, useEffect, useState} from 'react';
import LoadingContainer from '../LoadingContainer';
import {DATE_FORMAT} from '../../constants';
import moment from 'moment';
import './styles.less';
import {adjustTicketProperties} from '../../pages/TicketTrends/incidentsHelper';
import {EG_BRAND} from '../../constants';

const startDate = moment().subtract(90, 'days').format(DATE_FORMAT);
const endDate = moment().format(DATE_FORMAT);


const OngoingIncidents = ({selectedBrands}) => {
    const selectedBrand = selectedBrands[0];
    const [ongoingIncidents, setOngoingIncidents] = useState([]);
    const [allIncidents, setAllIncidents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const isOngoingIncident = (incident) => incident.status === 'In Progress' && (incident.priority === '1-Critical' || incident.priority === '0-Code Red');
    const filterOngoingIncidents = (incidents) =>
        (selectedBrand === EG_BRAND ? incidents : incidents.filter(incident => incident.Brand === selectedBrand))
        .filter(isOngoingIncident);

    useEffect(() => {
        const fetchTickets = () => {
            setIsLoading(true);

            fetch(`https://opxhub-service.us-west-2.test.expedia.com/api/v1/incidents?startDate=${startDate}&endDate=${endDate}`)
                .then((responses) => responses.json())
                .then((fetchedIncidents) => {
                    const adjustedIncidents = adjustTicketProperties(fetchedIncidents, 'incident');

                    setAllIncidents(adjustedIncidents);

                    const res = filterOngoingIncidents(adjustedIncidents);
                    console.log(res);

                    setOngoingIncidents(res);
                    setIsLoading(false);
                })
                .catch((err) => {
                    setIsLoading(false);
                    // eslint-disable-next-line no-console
                    console.error(err);
                });
        };

        fetchTickets();
    }, []);

    useEffect(() => {
        setOngoingIncidents(filterOngoingIncidents(allIncidents));
    }, [selectedBrand]);

    return (
        <Fragment>
            <h2 className="ongoing-incidents-label">{'Ongoing Incidents'}</h2>
            <LoadingContainer isLoading={isLoading} className="ongoing-incidents">
                {
                    ongoingIncidents.length ? ongoingIncidents.map((item) => {
                        return (
                            <div key={item.incidentSummary} className="ongoing-incident">
                                <span>{`${item.priority} - `}</span>
                                <span>{item.incidentSummary}</span>
                            </div>
                        );
                    }) : <div className="no-incidents">{'No ongoing incidents at the moment'}</div>
                }
            </LoadingContainer>
        </Fragment>
    );
};

export default OngoingIncidents;
