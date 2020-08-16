import {defects, incidents, prbs} from './dataService';
import {login, logout} from './oauth';
import {bookingsUserEvents} from './bookingsUserEvents';
import {csrUserEvents} from './csrUserEvents';
import {changeRequests} from './changeRequests';
import {pageViewsUserEvents} from './pageViews';
import {impulseBookingDataService, impulseFiltersService} from './impulseService';
import {funnelViewUserEvents} from './funnelView';
import {annotations} from './annotations';
import {productMapping} from './productMapping';

const apiRoutes = [
    login,
    logout,
    prbs,
    defects,
    incidents,
    bookingsUserEvents,
    csrUserEvents,
    changeRequests,
    pageViewsUserEvents,
    impulseBookingDataService,
    funnelViewUserEvents,
    annotations,
    productMapping,
    impulseFiltersService
];

export default apiRoutes;
