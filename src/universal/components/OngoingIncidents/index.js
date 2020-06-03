/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, {Fragment, useEffect, useState} from 'react';
import LoadingContainer from '../LoadingContainer';
import {DATE_FORMAT} from '../../pages/constants';
import moment from 'moment';
import './styles.less';

const startDate = moment().subtract(90, 'days').format(DATE_FORMAT);
const endDate = moment().format(DATE_FORMAT);


const OngoingIncidents = () => {
    const [incidents, setIncidents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTickets = () => {
            setIsLoading(true);

            fetch(`/api/v1/incidents?startDate=${startDate}&endDate=${endDate}`)
                .then((responses) => responses.json())
                .then((fetchedIncidents) => {
                    const filteredIncidents = fetchedIncidents.filter((incident) => {
                        return incident.status === 'In Progress' && (incident.priority === '1-Critical' || incident.priority === '0-Code Red');
                    });

                    setIncidents(filteredIncidents);
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

    return (
        <Fragment>
            <h2 className="ongoing-incidents-label">{'Ongoing Incidents'}</h2>
            <div className="ongoing-incidents">
                <LoadingContainer isLoading={isLoading}>
                    {
                        incidents.map((item) => {
                            return (
                                <div key={item.incidentSummary} className="ongoing-incident">
                                    <span>{`${item.priority} - `}</span>
                                    <span>{item.incidentSummary}</span>
                                </div>
                            );
                        })
                    }
                </LoadingContainer>
            </div>
        </Fragment>
    );
};

export default OngoingIncidents;
