import {login, logout} from './oauth';
import {defects, incidents, incidentsV2, epsIncidents, prbs, portfolio} from './dataService';
import {bookingsUserEvents, pageViewsUserEvents, impulseBookingDataService, impulseFiltersService, funnelViewUserEvents, csrUserEvents} from './userEventsService';
import {changeRequests, annotations, productMapping} from './changeRequestService';

const apiRoutes = [
    // oauth
    login,
    logout,
    // data service
    defects,
    incidents,
    incidentsV2,
    epsIncidents,
    prbs,
    portfolio,
    // user events service
    bookingsUserEvents,
    pageViewsUserEvents,
    impulseBookingDataService,
    impulseFiltersService,
    funnelViewUserEvents,
    csrUserEvents,
    // change request service
    changeRequests,
    annotations,
    productMapping
];

export default apiRoutes;
