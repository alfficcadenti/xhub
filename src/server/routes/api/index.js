import {apiService} from './apiService';
import {resiliencyQuestionnaire} from './resiliencyQuestionnaire';
import questionnaireHistory from './questionnaireHistory';
import resiliencyQuestions from './resiliencyQuestions';
import grafanaAlertsApi from './grafanaAlertsApi';
import {login, logout} from './oauth';

const apiRoutes = [
    login,
    logout,
    apiService,
    resiliencyQuestionnaire,
    resiliencyQuestions,
    questionnaireHistory,
    grafanaAlertsApi
];

export default apiRoutes;
