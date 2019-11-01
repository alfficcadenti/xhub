import backendApiGet from './backendApiGet';
import backendApiPost from './backendApiPost';

import resiliencyQuestions from './resiliencyQuestions';
const apiRoutes = [
    backendApiPost,
    backendApiGet,
    resiliencyQuestions
];

export default apiRoutes;
