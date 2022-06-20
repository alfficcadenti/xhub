import {OPXHUB_SUPPORT_CHANNEL} from '../../constants';
import {LOGIN_VIEWS_LABEL, LOGIN_EVENT_TYPE, PAGEVIEWS_METRICS, VIEW_TYPES} from './constants';


export const getErrorMessage = (selectedBrand) => {
    return `Page views for ${selectedBrand} is not yet available.
        The following brands are supported at this time: "Expedia", "Hotels.com Retail", and "Vrbo Retail".
        If you have any questions, please ping ${OPXHUB_SUPPORT_CHANNEL} or leave a comment via our Feedback form.`;
};

export const isViewSelected = (viewType) => VIEW_TYPES.includes(viewType);

export const isMetricGroupSelected = (pageMetric) => PAGEVIEWS_METRICS.includes(pageMetric);

export const getPageEventType = (metricGroup) => metricGroup === LOGIN_VIEWS_LABEL ? LOGIN_EVENT_TYPE : [];
