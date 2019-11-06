import backendApiGet from './backendApiGet';
import backendApiPost from './backendApiPost';
import questionnaireHistory from './questionnaireHistory';
import resiliencyQuestions from './resiliencyQuestions';

const apiRoutes = [
    backendApiPost,
    backendApiGet,
    resiliencyQuestions,
    questionnaireHistory
];

export default apiRoutes;
