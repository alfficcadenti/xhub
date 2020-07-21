/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, {Fragment, useEffect, useState} from 'react';
import {Divider} from '@homeaway/react-collapse';
import LoadingContainer from '../LoadingContainer';
import {DATE_FORMAT} from '../../constants';
import moment from 'moment';
import './styles.less';
import {divisionToBrand} from '../../pages/TicketTrends/incidentsHelper';
import {EG_BRAND} from '../../constants';

const startDate = moment().subtract(2, 'months').format(DATE_FORMAT);
const endDate = moment().format(DATE_FORMAT);


const OngoingIncidents = ({selectedBrands}) => {
    const selectedBrand = selectedBrands[0];
    const [ongoingIncidents, setOngoingIncidents] = useState([]);
    const [allIncidents, setAllIncidents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const isOngoingIncident = (incident) => (incident.status === 'In Progress' || incident.status === 'Escalated') && (incident.priority === '1-Critical' || incident.priority === '0-Code Red' || incident.priority === '2-High');
    const filterByBrand = (incident) => divisionToBrand(incident.brand) === selectedBrand;
    const filterOngoingIncidents = (incidents) =>
        selectedBrand === EG_BRAND ? incidents : incidents
            .filter(filterByBrand)
            .filter(isOngoingIncident);

    useEffect(() => {
        const fetchTickets = () => {
            setIsLoading(true);

            fetch(`https://opxhub-service.us-west-2.test.expedia.com/api/v1/incidents?startDate=${startDate}&endDate=${endDate}`)
                .then((responses) => responses.json())
                .then((fetchedIncidents) => {
                    setAllIncidents(fetchedIncidents);
                    setOngoingIncidents(filterOngoingIncidents(fetchedIncidents));
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

    const getDateDetails = (date) => moment(date).format('dddd, MMMM Do YYYY, h:mm a [GMT]Z');

    return (
        <Fragment>
            <h2 className="ongoing-incidents-label">{'Ongoing Incidents'}</h2>
            <LoadingContainer isLoading={isLoading} className="ongoing-incidents">
                {
                    ongoingIncidents.length ? ongoingIncidents.map(({incidentSummary, priority, startedAt, incidentNumber}) => {
                        return (
                            <Divider key={incidentNumber} heading={incidentSummary} id="ongoing-incident">
                                <div key={incidentSummary} className="ongoing-incident">
                                    <div><strong>{'Summary:'}</strong><span className="ongoing-incident-info">{incidentSummary}</span></div>
                                    <div><strong>{'Ticket:'}</strong><a target="_blank" href={`https://jira.homeawaycorp.com/browse/${incidentNumber}`}><span className="ongoing-incident-info">{incidentNumber}</span></a></div>
                                    <div><strong>{'Priority:'}</strong><span className="ongoing-incident-info">{priority}</span></div>
                                    <div><strong>{'Started at:'}</strong><span className="ongoing-incident-info">{getDateDetails(startedAt)}</span></div>
                                </div>
                            </Divider>
                        );
                    }) : <div className="no-incidents">{'No ongoing incidents for the selected brand'}</div>
                }
            </LoadingContainer>
        </Fragment>
    );
};

export default OngoingIncidents;
