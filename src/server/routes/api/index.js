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
    robbie,
    agileScoreCard
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
    impulseYOY,
    impulseFiltersService,
    impulseRevloss,
    impulseRevlossV2,
    impulseRevlossApiFirst,
    impulseRevlossV2ApiFirst,
    epsFunnelViewUserEvents,
    funnelViewUserEvents,
    csrUserEvents
} from './userEventsService';
import {changeRequests, deployments, productMapping, abTests} from './changeRequestService';
import {
    postFciComment
} from './userEventsAnalysisService';
import {impulseHealth, impulseAnomalies, impulseAnomaliesGrouped} from './impulseDataService';
import {impulsePrediction} from './anomalyDetector';
import {
    checkoutFailures,
    checkoutFailuresErrorCategories,
    checkoutFailuresErrorCodes,
    checkoutFailuresLobs,
    checkoutFailuresSearch,
    checkoutFailuresSites,
    checkoutFailuresCategoryCounts,
    checkoutFailuresComments,
    checkoutFailuresErrorCounts,
    deltaUser,
    deltaUserDetails,
    deltaUserBySessionId
} from './fciDataService';
import {availability} from './egAvailabilityService';


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
    agileScoreCard,
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
    impulseYOY,
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
    deployments,
    productMapping,
    abTests,
    // user events analysis service
    postFciComment,
    // impulse data service
    impulseHealth,
    impulseAnomalies,
    impulseAnomaliesGrouped,
    // opxhub booking anomaly detector
    impulsePrediction,
    // fci data service
    checkoutFailures,
    checkoutFailuresErrorCategories,
    checkoutFailuresErrorCodes,
    checkoutFailuresLobs,
    checkoutFailuresSearch,
    checkoutFailuresSites,
    checkoutFailuresCategoryCounts,
    checkoutFailuresComments,
    checkoutFailuresErrorCounts,
    deltaUser,
    deltaUserDetails,
    deltaUserBySessionId,
    // eg avail data service
    availability
];

export default apiRoutes;
