import {apiService} from './apiService';
import {userEventsApiService} from './userEventsApiService';
import {prbs} from './prbs';
import {resiliencyQuestionnaire} from './resiliencyQuestionnaire';
import questionnaireHistory from './questionnaireHistory';
import resiliencyQuestions from './resiliencyQuestions';
import grafanaAlerts from './grafanaAlerts';
import {login, logout} from './oauth';
import {availabilityS3} from './availabilityS3';

const apiRoutes = [
    login,
    logout,
    apiService,
    userEventsApiService,
    prbs,
    resiliencyQuestionnaire,
    resiliencyQuestions,
    questionnaireHistory,
    availabilityS3,
    grafanaAlerts
];

export default apiRoutes;
