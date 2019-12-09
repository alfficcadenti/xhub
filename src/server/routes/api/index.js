import backendApiGet from './backendApiGet';
import backendApiPost from './backendApiPost';
import questionnaireHistory from './questionnaireHistory';
import resiliencyQuestions from './resiliencyQuestions';
import {login,logout} from './oauth'

const apiRoutes = [
    login,
    logout,
    backendApiPost,
    backendApiGet,
    resiliencyQuestions,
    questionnaireHistory,
];

export default apiRoutes;
