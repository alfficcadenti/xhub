import {PAGE_VIEWS_DATE_FORMAT, PAGES_LIST, LOB_LIST} from '../../constants';
import moment from 'moment';
import 'moment-timezone';

const TIMEZONE_OFFSET = (new Date()).getTimezoneOffset();
const TIMEZONE_ABBR = moment.tz.zone(moment.tz.guess()).abbr(TIMEZONE_OFFSET);

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
                        time: momentTime.format(PAGE_VIEWS_DATE_FORMAT),
                        momentTime: momentTime.format(),
                    });
                }
            }
        });
        return {pageName: label, aggregatedData, pageBrand, lob: true};
    });
};