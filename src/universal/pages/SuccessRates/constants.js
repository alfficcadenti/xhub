export const SHOPPING_RATES_LABEL = 'Shopping Success Rates';

export const LOGIN_RATES_LABEL = 'Login Success Rates';

export const SELECT_METRIC_LABEL = 'Select Metric';

export const RATE_METRICS = [SHOPPING_RATES_LABEL, LOGIN_RATES_LABEL];

export const NATIVE_VIEW_LABEL = 'Native View';

export const GRAFANA_VIEW_LABEL = 'Grafana View';

export const SELECT_VIEW_LABEL = 'Select View';

export const VIEW_TYPES = [NATIVE_VIEW_LABEL, GRAFANA_VIEW_LABEL];

export const SHOPPING_METRICS = [
    {metricName: 'SearchSuccessRate', chartName: 'Home To Search Page (SERP)'},
    {metricName: 'SERPSuccessRate', chartName: 'Search (SERP) To Property Page (PDP)'},
    {metricName: 'PDPSuccessRate', chartName: 'Property (PDP) To Checkout Page (CKO)'},
    {metricName: 'checkoutSuccessRate', chartName: 'Checkout (CKO) To Checkout Confirmation Page'}
];

export const LOGIN_METRICS = [
    {metricName: 'ownerLoginRate', chartName: 'Owner Login Rate'},
    {metricName: 'travelerLoginRate', chartName: 'Traveler Login Rate'},
    {metricName: 'universalLoginRate', chartName: 'Universal Login Rate'}
];

export const EPS_PARTNER_TPIDS = [
    {label: 'RBC', value: '70205'},
    {label: 'Chase', value: '70501'}
];

export const AVAILABLE_LOBS = ['H', 'C', 'F', 'CR', 'P', 'A'];
