export const SHOPPING_VIEWS_LABEL = 'Shopping Page Views';

export const LOGIN_VIEWS_LABEL = 'Login Page Views';

export const SELECT_METRIC_LABEL = 'Select Metric';

export const PAGEVIEWS_METRICS = [SHOPPING_VIEWS_LABEL, LOGIN_VIEWS_LABEL];

export const NATIVE_VIEW_LABEL = 'Native View';

export const GRAFANA_VIEW_LABEL = 'Grafana View';

export const SELECT_VIEW_LABEL = 'Select View';

export const VIEW_TYPES = [NATIVE_VIEW_LABEL, GRAFANA_VIEW_LABEL];

export const LOGIN_EVENT_TYPE = [
    {eventType: 'loginform', chartName: 'Sign-in Presented'},
    {eventType: 'loginattemptclick', chartName: 'Sign-in Submitted'},
    {eventType: 'loginsuccesspageview', chartName: 'Sign-in Succeded'},
    {eventType: 'universalLoginError', chartName: 'Sign-in Failed'},
    {eventType: 'loginAdjustedSuccessOutcome', chartName: 'Bad user name / password'}
];