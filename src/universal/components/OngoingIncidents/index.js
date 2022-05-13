import React, {Fragment, useEffect, useState, useCallback} from 'react';
import {Divider} from '@homeaway/react-collapse';
import LoadingContainer from '../LoadingContainer';
import {DATE_FORMAT} from '../../constants';
import moment from 'moment';
import './styles.less';
import {EG_BRAND} from '../../constants';
import {checkResponse, divisionToBrand, buildTicketLink} from '../../pages/utils';
import HelpText from '../../components/HelpText/HelpText';

const fromDate = moment().subtract(2, 'months').format(DATE_FORMAT);
const toDate = moment().format(DATE_FORMAT);


const OngoingIncidents = ({selectedBrands}) => {
    const selectedBrand = selectedBrands[0];
    const [ongoingIncidents, setOngoingIncidents] = useState([]);
    const [allIncidents, setAllIncidents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const isOngoingIncident = (incident) => (incident.status === 'In Progress' || incident.status === 'Escalated') && (incident.priority === '1-Critical' || incident.priority === '2-High');

    const filterOngoingIncidents = useCallback((incidents) =>
        (selectedBrand === EG_BRAND ? incidents : incidents.filter((incident) => divisionToBrand(incident.brand) === selectedBrand))
            .filter(isOngoingIncident), [selectedBrand]);

    useEffect(() => {
        const fetchTickets = () => {
            setIsLoading(true);
            const browserTimezone = moment.tz.guess();
            fetch(`/v1/incidents?from_date=${moment(fromDate).tz(browserTimezone).toISOString()}&to_date=${moment(toDate).tz(browserTimezone).toISOString()}`)
                .then(checkResponse)
                .then((fetchedIncidents) => {
                    setAllIncidents(fetchedIncidents);
                    setOngoingIncidents(filterOngoingIncidents(fetchedIncidents));
                    setIsLoading(false);
                })
                .catch((err) => {
                    setIsLoading(false);
                    console.error(err);
                });
        };

        fetchTickets();
    }, [filterOngoingIncidents]);

    useEffect(() => {
        setOngoingIncidents(filterOngoingIncidents(allIncidents));
    }, [selectedBrand, filterOngoingIncidents, allIncidents]);

    const getDateDetails = (date) => moment(date).format('dddd, MMMM Do YYYY, h:mm a [GMT]Z');
    return (
        <Fragment>
            <h2 className="ongoing-incidents-label">
                <a target="_blank" rel="noopener noreferrer" href="https://expedia.service-now.com/triage/Triage.do" className="ongoing-incidents-tile-link">
                    <HelpText text={'Click to open Expedia Service Now Triage'} placement="bottom" />
                </a>
                {'Ongoing Incidents'}
            </h2>
            <LoadingContainer isLoading={isLoading} className="ongoing-incidents">
                {
                    ongoingIncidents.length ? ongoingIncidents.map(({summary, priority, startDate, id, brand}) => {
                        return (
                            <Divider key={id} heading={summary} id="ongoing-incident">
                                <div key={summary} className="ongoing-incident">
                                    <div><strong>{'Summary:'}</strong><span className="ongoing-incident-info">{summary}</span></div>
                                    <div><strong>{'Ticket:'}</strong>{buildTicketLink(id, brand)}</div>
                                    <div><strong>{'Priority:'}</strong><span className="ongoing-incident-info">{priority}</span></div>
                                    <div><strong>{'Started at:'}</strong><span className="ongoing-incident-info">{getDateDetails(startDate)}</span></div>
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
