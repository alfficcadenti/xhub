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
    impulseChangePercentage,
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
    fciUserEvents,
    fciErrorCounts,
    fciCategoryCounts,
    getFciComments,
    postFciComment
} from './userEventsAnalysisService';
import {impulseHealth, impulseAnomalies, impulseAnomaliesGrouped} from './impulseDataService';
import {impulsePrediction} from './anomalyDetector';
import {
    checkoutFailuresErrorCategories,
    checkoutFailuresErrorCodes,
    checkoutFailuresSearch,
    checkoutFailuresSites,
    deltaUser,
    deltaUserDetails,
    deltaUserBySessionId
} from './fciDataService';

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
    impulseChangePercentage,
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
    fciUserEvents,
    fciErrorCounts,
    fciCategoryCounts,
    getFciComments,
    postFciComment,
    // impulse data service
    impulseHealth,
    impulseAnomalies,
    impulseAnomaliesGrouped,
    // opxhub booking anomaly detector
    impulsePrediction,
    // fci data service
    checkoutFailuresErrorCategories,
    checkoutFailuresErrorCodes,
    checkoutFailuresSearch,
    checkoutFailuresSites,
    deltaUser,
    deltaUserDetails,
    deltaUserBySessionId
];

export default apiRoutes;
