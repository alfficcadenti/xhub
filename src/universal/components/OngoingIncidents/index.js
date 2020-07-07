/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, {Fragment, useEffect, useState} from 'react';
import {Divider} from '@homeaway/react-collapse';
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
        (selectedBrand === EG_BRAND ? incidents : incidents.filter((incident) => incident.Brand === selectedBrand))
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

    const getDateDetails = (date) => moment(date).format('dddd, MMMM Do YYYY, h:mm a [GMT]Z');

    return (
        <Fragment>
            <h2 className="ongoing-incidents-label">{'Ongoing Incidents'}</h2>
            <LoadingContainer isLoading={isLoading} className="ongoing-incidents">
                {
                    ongoingIncidents.length ? ongoingIncidents.map(({incidentSummary, priority, startedAt, incidentNumber}) => {
                        return (
                            <Divider heading={incidentSummary} id="ongoing-incident">
                                <div key={incidentSummary} className="ongoing-incident">
                                    <div><strong>{'Summary:'}</strong><span className="ongoing-incident-info">{incidentSummary}</span></div>
                                    <div><strong>{'Incident Ticket:'}</strong><a target="_blank" href={`https://jira.homeawaycorp.com/browse/${incidentNumber}`}><span className="ongoing-incident-info">{incidentNumber}</span></a></div>
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
