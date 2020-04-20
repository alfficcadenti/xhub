import {apiService} from './apiService';
import {resiliencyQuestionnaire} from './resiliencyQuestionnaire';
import questionnaireHistory from './questionnaireHistory';
import resiliencyQuestions from './resiliencyQuestions';
import {login, logout} from './oauth';

const apiRoutes = [
    login,
    logout,
    apiService,
    resiliencyQuestionnaire,
    resiliencyQuestions,
    questionnaireHistory,
];

export default apiRoutes;
