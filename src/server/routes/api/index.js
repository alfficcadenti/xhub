import {apiService} from './apiService';
import {prbs} from './prbs';
import {resiliencyQuestionnaire} from './resiliencyQuestionnaire';
import questionnaireHistory from './questionnaireHistory';
import resiliencyQuestions from './resiliencyQuestions';
import grafanaAlerts from './grafanaAlerts';
import {login, logout} from './oauth';
import {availabilityS3} from './availabilityS3';
import {bookingsUserEvents} from './bookingsUserEvents';
import {csrUserEvents} from './csrUserEvents';
import {pageViewsUserEvents} from './pageViews';
import {impulseBookingDataService} from './impulseService';

const apiRoutes = [
    login,
    logout,
    apiService,
    prbs,
    resiliencyQuestionnaire,
    resiliencyQuestions,
    questionnaireHistory,
    availabilityS3,
    grafanaAlerts,
    bookingsUserEvents,
    csrUserEvents,
    pageViewsUserEvents,
    impulseBookingDataService
];

export default apiRoutes;
