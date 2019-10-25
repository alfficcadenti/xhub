import redirect from './redirect';
import apiRoutes from './api/index';

export const routes = [
    redirect,
    ...apiRoutes
];
