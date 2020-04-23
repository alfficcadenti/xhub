import {apiService} from './apiService';
import {prbs} from './prbs';
import {resiliencyQuestionnaire} from './resiliencyQuestionnaire';
import questionnaireHistory from './questionnaireHistory';
import resiliencyQuestions from './resiliencyQuestions';
import grafanaAlertsApi from './grafanaAlertsApi';
import grafanaAlerts from './grafanaAlerts';
import {login, logout} from './oauth';
import {availabilityS3} from './availabilityS3';

const apiRoutes = [
    login,
    logout,
    apiService,
    prbs,
    resiliencyQuestionnaire,
    resiliencyQuestions,
    questionnaireHistory,
    availabilityS3,
    grafanaAlertsApi,
    grafanaAlerts
];

export default apiRoutes;
