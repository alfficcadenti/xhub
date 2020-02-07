import backendApiGet from './backendApiGet';
import {resiliencyQuestionnaire} from './resiliencyQuestionnaire';
import questionnaireHistory from './questionnaireHistory';
import resiliencyQuestions from './resiliencyQuestions';
import {login, logout} from './oauth';

const apiRoutes = [
    login,
    logout,
    resiliencyQuestionnaire,
    backendApiGet,
    resiliencyQuestions,
    questionnaireHistory,
];

export default apiRoutes;
