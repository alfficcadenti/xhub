import {apiService} from './apiService';
import {prbs} from './prbs';
import {resiliencyQuestionnaire} from './resiliencyQuestionnaire';
import questionnaireHistory from './questionnaireHistory';
import resiliencyQuestions from './resiliencyQuestions';
import grafanaAlertsApi from './grafanaAlertsApi';
import grafanaAlerts from './grafanaAlerts';
import {login, logout} from './oauth';

const apiRoutes = [
    login,
    logout,
    apiService,
    prbs,
    resiliencyQuestionnaire,
    resiliencyQuestions,
    questionnaireHistory,
    grafanaAlertsApi,
    grafanaAlerts
];

export default apiRoutes;
