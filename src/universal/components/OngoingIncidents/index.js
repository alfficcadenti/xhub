/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, {Fragment, useEffect, useState} from 'react';
import {DATE_FORMAT} from '../../pages/constants';
import moment from 'moment';
import './styles.less';

const startDate = moment().subtract(90, 'days').format(DATE_FORMAT);
const endDate = moment().format(DATE_FORMAT);


const OngoingIncidents = () => {
    const [incidents, setIncidents] = useState([]);

    useEffect(() => {
        const fetchTickets = () => {
            fetch(`https://opxhub-service.us-west-2.int.expedia.com/api/v1/incidents?startDate=${startDate}&endDate=${endDate}`)
                .then((responses) => responses.json())
                .then((fetchedIncidents) => {
                    const filteredIncidents = fetchedIncidents.filter((incident) => {
                        return incident.status === 'In Progress' && (incident.priority === '1-Critical' || incident.priority === '0-Code Red');
                    });

                    setIncidents(filteredIncidents);
                })
                .catch((err) => {
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
            </div>
        </Fragment>
    );
};

export default OngoingIncidents;
