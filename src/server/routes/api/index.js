import {login, logout} from './oauth';
import {
    correctiveActionsDetails,
    correctiveActions,
    defects,
    dogFood,
    incidents,
    incidentsV2,
    epsIncidents,
    prbs,
    portfolio,
    orgMetrics,
    robbie
} from './dataService';
import {
    bookingsUserEvents,
    epsPageViewsLoBUserEvents,
    epsPageViewsUserEvents,
    pageViewsUserEvents,
    pageViewsLoBUserEvents,
    impulseBookingDataService,
    impulseBookingDataGrouped,
    impulseBrandsService,
    impulseFiltersService,
    impulseRevloss,
    impulseRevlossV2,
    impulseRevlossApiFirst,
    impulseRevlossV2ApiFirst,
    epsFunnelViewUserEvents,
    funnelViewUserEvents,
    csrUserEvents
} from './userEventsService';
import {changeRequests, annotations, productMapping, abTests} from './changeRequestService';
import {
    fciUserEvent,
    fciUserEvents,
    fciErrorCounts,
    fciCategoryCounts,
    fciSites,
    fciErrorCodes,
    fciErrorCategories,
    getFciComments,
    postFciComment
} from './userEventsAnalysisService';
import {impulseHealth, impulseAnomalies, impulseAnomaliesGrouped} from './impulseDataService';
import {impulsePrediction} from './anomalyDetector';
import {deltaUser, deltaUserDetails, deltaUserBySessionId} from './deltaUserService';


const apiRoutes = [
    // oauth
    login,
    logout,
    // data service
    correctiveActionsDetails,
    correctiveActions,
    defects,
    dogFood,
    incidents,
    incidentsV2,
    epsIncidents,
    prbs,
    portfolio,
    orgMetrics,
    robbie,
    // user events service
    bookingsUserEvents,
    epsPageViewsLoBUserEvents,
    epsPageViewsUserEvents,
    pageViewsUserEvents,
    pageViewsLoBUserEvents,
    impulseBookingDataService,
    impulseBookingDataGrouped,
    impulseBrandsService,
    impulseFiltersService,
    impulseRevloss,
    impulseRevlossV2,
    impulseRevlossApiFirst,
    impulseRevlossV2ApiFirst,
    epsFunnelViewUserEvents,
    funnelViewUserEvents,
    csrUserEvents,
    // change request service
    changeRequests,
    annotations,
    productMapping,
    abTests,
    // user events analysis service
    fciUserEvent,
    fciUserEvents,
    fciErrorCounts,
    fciCategoryCounts,
    fciSites,
    fciErrorCodes,
    fciErrorCategories,
    getFciComments,
    postFciComment,
    // impulse data service
    impulseHealth,
    impulseAnomalies,
    impulseAnomaliesGrouped,
    // opxhub booking anomaly detector
    impulsePrediction,
    // delta user  service
    deltaUser,
    deltaUserDetails,
    deltaUserBySessionId
];

export default apiRoutes;
