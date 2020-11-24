import {PAGE_VIEWS_DATE_FORMAT, PAGES_LIST, LOB_LIST, TIMEZONE_ABBR} from '../../constants';
import moment from 'moment';

export const buildPageViewsApiQueryString = ({start, end, brand, lob = false, EPSPartner = ''}) => {
    const dateQuery = start && end
        ? `&startDate=${moment(start).utc().format()}&endDate=${moment(end).utc().format()}`
        : '';
    const baseUrl = lob ? '/v1/pageViewsLoB' : '/v1/pageViews';
    if (brand === 'eps') {
        return `${baseUrl}/eps?timeInterval=1${dateQuery}&sitename=${EPSPartner}`;
    }
    return `${baseUrl}?brand=${brand}&timeInterval=1${dateQuery}`;
};

export const makePageViewLoBObjects = (data = [], start, end, pageBrand = '') => {
    return PAGES_LIST.map(({name, label}) => {
        const aggregatedData = [];
        data.forEach(({time, pageViewsData}) => {
            const currentPageViews = pageViewsData.filter((item) => item.page === name);
            if (currentPageViews) {
                const viewsByLoB = currentPageViews.reduce((acc, cum) => {
                    const lob = LOB_LIST.find((x) => x.value === cum.lineOfBusiness);
                    if (lob && lob.label) {
                        acc[lob.label] = cum.views;
                    }
                    return acc;
                }, {});
                const momentTime = moment(time);
                if (momentTime.isBetween(start, end, 'minutes', '[]')) {
                    aggregatedData.push({
                        ...viewsByLoB,
                        label: `${momentTime.format(PAGE_VIEWS_DATE_FORMAT)} ${TIMEZONE_ABBR}`,
                        time: moment.utc(time).valueOf()
                    });
                }
            }
        });
        return {pageName: label, aggregatedData, pageBrand, lob: true};
    });
};

export const makePageViewObjects = (data = [], start, end, pageBrand = '') => {
    let minValue;

    return PAGES_LIST.map(({name, label}, i) => {
        const aggregatedData = [];
        const tempMinValue = data.reduce((prev, {time, pageViewsData}) => {
            const currentPageViews = pageViewsData.find((item) => item.page === name);
            if (currentPageViews) {
                const momentTime = moment(time);
                if (momentTime.isBetween(start, end, 'minutes', '[]')) {
                    aggregatedData.push({
                        label: `${momentTime.format(PAGE_VIEWS_DATE_FORMAT)} ${TIMEZONE_ABBR}`,
                        time: moment.utc(time).valueOf(),
                        value: currentPageViews.views
                    });
                }
            }

            return Math.min(prev, currentPageViews ? currentPageViews.views : prev);
        }, data[0] && data[0].pageViewsData ? data[0].pageViewsData.find((item) => item.page === name) && data[0].pageViewsData.find((item) => item.page === name).views || 0 : 0);

        if (i === 0) {
            minValue = tempMinValue;
        } else {
            minValue = tempMinValue < minValue ? tempMinValue : minValue;
        }

        return {pageName: label, aggregatedData, pageBrand};
    }).map((item) => ({...item, minValue}));
};
