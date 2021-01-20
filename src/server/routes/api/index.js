import {login, logout} from './oauth';
import {correctiveActions, defects, incidents, incidentsV2, epsIncidents, prbs, portfolio} from './dataService';
import {bookingsUserEvents, epsPageViewsLoBUserEvents, epsPageViewsUserEvents, pageViewsUserEvents, pageViewsLoBUserEvents, impulseBookingDataService, impulseBrandsService, impulseFiltersService, impulseRevloss, impulseRevlossV2, epsFunnelViewUserEvents, funnelViewUserEvents, csrUserEvents} from './userEventsService';
import {changeRequests, annotations, productMapping, abTests} from './changeRequestService';
import {fciUserEvents, getFciComments, postFciComment} from './userEventsAnalysisService';

const apiRoutes = [
    // oauth
    login,
    logout,
    // data service
    correctiveActions,
    defects,
    incidents,
    incidentsV2,
    epsIncidents,
    prbs,
    portfolio,
    // user events service
    bookingsUserEvents,
    epsPageViewsLoBUserEvents,
    epsPageViewsUserEvents,
    pageViewsUserEvents,
    pageViewsLoBUserEvents,
    impulseBookingDataService,
    impulseBrandsService,
    impulseFiltersService,
    impulseRevloss,
    impulseRevlossV2,
    epsFunnelViewUserEvents,
    funnelViewUserEvents,
    csrUserEvents,
    // change request service
    changeRequests,
    annotations,
    productMapping,
    abTests,
    // user events analysis service
    fciUserEvents,
    getFciComments,
    postFciComment
];

export default apiRoutes;
