import {login, logout} from './oauth';
import {defects, incidents, incidentsV2, impulseIncidents, epsIncidents, prbs, portfolio} from './dataService';
import {bookingsUserEvents, pageViewsUserEvents, impulseBookingDataService, impulseBrandsService, impulseFiltersService, impulseRevloss, impulseRevlossImpact, funnelViewUserEvents, csrUserEvents} from './userEventsService';
import {changeRequests, annotations, productMapping} from './changeRequestService';

const apiRoutes = [
    // oauth
    login,
    logout,
    // data service
    defects,
    incidents,
    incidentsV2,
    impulseIncidents,
    epsIncidents,
    prbs,
    portfolio,
    // user events service
    bookingsUserEvents,
    pageViewsUserEvents,
    impulseBookingDataService,
    impulseBrandsService,
    impulseFiltersService,
    impulseRevloss,
    impulseRevlossImpact,
    funnelViewUserEvents,
    csrUserEvents,
    // change request service
    changeRequests,
    annotations,
    productMapping
];

export default apiRoutes;
