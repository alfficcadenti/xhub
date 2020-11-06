import {login, logout} from './oauth';
import {defects, incidents, incidentsV2, epsIncidents, prbs, portfolio} from './dataService';
import {bookingsUserEvents, pageViewsUserEvents, pageViewsLoBUserEvents, impulseBookingDataService, impulseBrandsService, impulseFiltersService, impulseRevloss, funnelViewUserEvents, csrUserEvents} from './userEventsService';
import {changeRequests, annotations, productMapping, abTests} from './changeRequestService';

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
    pageViewsLoBUserEvents,
    impulseBookingDataService,
    impulseBrandsService,
    impulseFiltersService,
    impulseRevloss,
    funnelViewUserEvents,
    csrUserEvents,
    // change request service
    changeRequests,
    annotations,
    productMapping,
    abTests
];

export default apiRoutes;
