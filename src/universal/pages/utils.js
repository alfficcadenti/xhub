import React from 'react';
import qs from 'query-string';
import moment from 'moment';
import {getTzFormat} from '../components/TimeZonePicker/utils';
import {
    BRANDS,
    DATE_FORMAT,
    EGENCIA_BRAND,
    EXPEDIA_BRAND,
    EXPEDIA_PARTNER_SERVICES_BRAND,
    HOTELS_COM_BRAND,
    LOB_LIST,
    PAGE_VIEWS_DATE_FORMAT,
    VRBO_BRAND,
    GRAFANA_DASHBOARDS
} from '../constants';
import {getOrDefault} from '../utils';
import {
    ENABLED_RESET_GRAPH_BUTTON,
    DISABLED_RESET_GRAPH_BUTTON
} from './Impulse/constants';
import {LOGIN_RATES_LABEL} from './SuccessRates/constants';
import ALL_PAGES from './index';
import {getRateMetrics} from './SuccessRates/utils';
import {
    SELECT_VIEW_LABEL,
    VIEW_TYPES,
    PAGEVIEWS_METRICS,
    SELECT_METRIC_LABEL
} from './FunnelView/constants';


const BOOKING_COUNT = 'Booking Counts';

const PREDICTION_COUNT = 'Prediction Counts';

export const DEFAULT_DAY_RANGE = 3;

export const getVisiblePages = (selectedBrands, pages = [...ALL_PAGES]) => (
    pages.filter(({hidden, brands}) => (
        !hidden && (!brands || brands.filter((brand) => selectedBrands.includes(brand)).length > 0)
    ))
);

export const getPieData = (items = [], property) => {
    const counts = items
        .reduce((acc, curr) => {
            const key = curr[property];
            if (!acc[key]) {
                acc[key] = 0;
            }
            acc[key]++;
            return acc;
        }, {});
    return Object.entries(counts).map(([name, value]) => ({name, value}));
};

export const isNotEmptyString = (item) => !!item;

export const isNotDuplicate = (value, index, self) => self.indexOf(value) === index;

export const mapBrandNames = (brandName) => {
    switch (brandName) {
        case 'expedia':
            return EXPEDIA_BRAND;
        case 'vrbo':
            return VRBO_BRAND;
        case 'hcom':
            return HOTELS_COM_BRAND;
        case null:
            return EXPEDIA_PARTNER_SERVICES_BRAND;
        default:
            return brandName;
    }
};

export const checkResponse = (response) => {
    if (!response.ok || response.error) {
        throw new Error(response);
    }
    return response.json();
};

export const mapGroupedData = (GroupedDataFuture, GroupedData) => (
    GroupedDataFuture.map((item, i) => {
        if (GroupedData[i]) {
            item = GroupedData[i];
        }
        return item;
    })
);

export const regionalGroupedData = (GroupedDataRegion) => (
    GroupedDataRegion.forEach((data) => {
        if (data.hasOwnProperty('EU') || data.hasOwnProperty('EMEA')) {
            data['EMEA+EU'] = (data.EMEA || 0) + (data.EU || 0);
            delete data.EMEA;
            delete data.EU;
        }
    })
);

export const threeWeekComparison = (threeWeekAvg, bookingCount) => {
    if (threeWeekAvg === '0') {
        return 'null';
    }
    const per = (Math.round((bookingCount - threeWeekAvg) * 100) / threeWeekAvg).toFixed(2);
    return `${per}%`;
};

export const checkIsContentPercentage = (content) => {
    if (!Number(content) && content.includes('%')) {
        return content.includes('-') ? 'negative' : 'positive';
    }
    return '';
};
export const getBrand = (brand, key) => BRANDS.find((b) => brand === b[key]) || {};

export const sortArrayByMostRecentDate = (arr, prop) => arr.sort((a, b) => new Date(b[prop]) - new Date(a[prop]));

// eslint-disable-next-line complexity
export const divisionToBrand = (division = '') => {
    switch (division && division.toUpperCase()) {
        case 'EGENCIA - CONSOLIDATED':
        case 'EGENCIA':
            return EGENCIA_BRAND;
        case 'VRBO':
        case 'HOME AWAY':
            return VRBO_BRAND;
        case 'HOTELS WORLDWIDE (HWW)':
        case 'HCOM':
        case 'HOTELS':
            return HOTELS_COM_BRAND;
        case 'EXPEDIA PARTNER SERVICES':
        case 'EPS':
        case 'EAN':
            return EXPEDIA_PARTNER_SERVICES_BRAND;
        default:
            return EXPEDIA_BRAND;
    }
};

const findTicket = (results, ids) => (
    results.find((t) => ids.some((i) => t.id && t.id.split(',').some((j) => i === j)))
);

const sharesImpactedBrand = (found, ticket) => (
    found.impacted_brand && ticket.impacted_brand && !found.impacted_brand.split(',').some((b) => ticket.impacted_brand.split(',').includes(b))
);

const copyOverDivisions = (ticket, found) => {
    if (ticket.divisions && !found.divisions) {
        found.divisions = ticket.divisions;
    } else if (ticket.divisions && ticket.divisions.length) {
        ticket.divisions.forEach((d) => {
            if (!found.divisions.includes(d)) {
                found.divisions.push(d);
            }
        });
    }
};

export const consolidateTicketsById = (tickets) => {
    const results = [];
    const ticketIdSet = new Set();
    if (Array.isArray(tickets)) {
        tickets.forEach((ticket) => {
            const {id} = ticket;
            if (!id) {
                return;
            }
            const ids = id.split(',');
            if (ids.some((i) => ticketIdSet.has(i))) {
                const found = findTicket(results, ids);
                if (sharesImpactedBrand(found, ticket)) {
                    found.impacted_brand += `,${ticket.impacted_brand}`;
                }
                const foundIds = found.id.split(',');
                ids.forEach((i) => {
                    if (!foundIds.includes(i)) {
                        found.id = `${found.id},${i}`;
                    }
                });
                copyOverDivisions(ticket, found);
                found.estimated_revenue_loss = `${parseFloat(found.estimated_revenue_loss) + parseFloat(getOrDefault(ticket, 'estimated_revenue_loss', 0))}`;
                found.estimated_gross_loss = `${parseFloat(found.estimated_gross_loss) + parseFloat(getOrDefault(ticket, 'estimated_gross_loss', 0))}`;
            } else {
                results.push(ticket);
            }
            ids.forEach((i) => ticketIdSet.add(i));
        });
    }

    return results;
};

export const getUniqueByProperty = (element, property) => {
    const group = element.reduce((acc, item) => {
        const id = item[property];
        if (acc[id]) {
            acc[id].push(item);
        } else {
            acc[id] = [item];
        }
        return acc;
    }, {});
    const output = [];

    for (let [_, val] of Object.entries(group)) {
        const obj = {...val[0]};
        obj.tag = [val[0].tag];
        for (let i = 1; i < val.length; ++i) {
            obj.tag.push(val[i].tag);
        }
        output.push(obj);
    }
    return output;
};

export const getListOfUniqueProperties = (data = [], prop) => {
    let isArray = false;
    // extract property value from tickets & determine if it's of type array
    const values = data.map((element) => {
        const value = element[prop];
        isArray = isArray || Array.isArray(value);
        return value;
    });
    if (!isArray) {
        // filter empty strings and duplicates
        const list = values.filter((value, index, self) => value && self.indexOf(value) === index);
        list.sort();
        return list;
    }
    // create a set of values and convert to array
    const list = Array.from(values
        .reduce((acc, value) => {
            if (Array.isArray(value)) {
                value.forEach((tag) => tag && acc.add(tag));
            } else if (value) {
                acc.add(value);
            }
            return acc;
        }, new Set()));
    // sort array ignoring case
    list.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
    return list;
};

export const buildTicketLink = (id = '', brand = '', url = '') => {
    if (url) {
        return (<a href={url} target="_blank" rel="noopener noreferrer">{id}</a>);
    }
    const brandInUppercase = brand && brand.toUpperCase();
    const brandUrl = brandInUppercase === VRBO_BRAND.toUpperCase() ? `https://jira.homeawaycorp.com/browse/${id}` : `https://expedia.service-now.com/go.do?id=${id}`;
    return (<a href={brandUrl} target="_blank" rel="noopener noreferrer">{id}</a>);
};

export const buildTicketLinks = (id = '', brand = '', url = '') => {
    const ids = id.split(',');
    const urls = url.split(',');
    if (ids.length > 1) {
        return (
            <div>
                {ids.map((i, idx) => <div>{buildTicketLink(i, brand, urls.length > idx ? urls[idx] : '')}</div>)}
            </div>
        );
    }
    return buildTicketLink(id, brand, url);
};

export const parseDurationToMinutes = (strDuration = '') => {
    if (typeof strDuration === 'number') {
        return strDuration;
    }
    if (!strDuration || strDuration === '0') {
        return 0;
    }
    const numRegex = new RegExp(/\d+/, 'g');
    const getNumValue = (str) => (
        strDuration.includes(str)
            ? Number.parseInt(numRegex.exec(strDuration)[0], 10)
            : 0
    );
    const days = getNumValue('d');
    const hours = getNumValue('h');
    const minutes = getNumValue('m');
    const totalMinutes = (days * 24 * 60) + (hours * 60) + minutes;
    return totalMinutes;
};

const getArray = (item) => {
    return Array.isArray(item)
        ? item.filter(isNotEmptyString)
        : (item || '').replace(/\[/g, '').replace(/\]/g, '').replace(/\'/g, '').split(',').filter(isNotEmptyString);
};

export const getImpactedPartners = (partners, lobs = []) => {
    const impactedPartners = getArray(partners);
    const impactedLobs = getArray(lobs);
    if (impactedPartners.length) {
        return impactedLobs.length
            ? impactedPartners.reduce((acc, curr) => acc.concat(impactedLobs.map((l) => `${curr}-${l}`)), []).join(', ')
            : impactedPartners;
    }
    return null;
};

export const mapEpsData = (t) => {
    const result = t;
    if (t.id && t.incidentNumber) {
        result.id = `${t.id},${t.incidentNumber}`;
    }
    result.incident_number = t.incidentNumber;
    result.start_date = t.startDate;
    result.end_date = t.endDate;
    result.identified_time = t.identifiedTime;
    result.root_cause = t.rootCause;
    result.root_cause_owner = t.rootCauseOwner;
    result.root_cause_category = t.rootCauseCategory;
    result.brand = EXPEDIA_PARTNER_SERVICES_BRAND;
    result.impacted_brand = EXPEDIA_PARTNER_SERVICES_BRAND;
    result.resolution_notes = t.resolutionNotes;
    result.notification_sent = t.notificationSent;
    result.duration = parseDurationToMinutes(t.duration) * 60 * 1000;
    result.time_to_detect = parseDurationToMinutes(t.timeToDetect);
    result.time_to_restore = parseDurationToMinutes(t.timeToRestore);
    result.impacted_partners = getImpactedPartners(t.impactedPartners);
    result.impacted_partners_lobs = getImpactedPartners(t.impactedPartners, t.impactedLobs || []);
    return result;
};

export const adjustInputValue = (inputArray = []) => {
    const uniqueFields = [];
    const adjustedInputValue = [];
    inputArray.forEach((x) => {
        if (x && x.key) {
            if (uniqueFields.indexOf(x.key) === -1) {
                uniqueFields.push(x.key);
                adjustedInputValue.push({key: x.key, values: [x.value]});
            } else {
                adjustedInputValue.find((y) => y.key === x.key).values.push(x.value);
            }
        }
    });
    return adjustedInputValue;
};

export const addSuggestionType = (suggestions, type, items) => {
    if (!suggestions[type] && items.length) {
        suggestions[type] = items;
    }
    return suggestions;
};

export const getAnnotationsFilter = (selectedItems, property, toLowerCase = false) => (
    toLowerCase
        ? (a) => !selectedItems.length || selectedItems.includes(a[property].toLowerCase())
        : (a) => !selectedItems.length || selectedItems.includes(a[property])
);

export const filterNewSelectedItems = (input, key) => {
    const items = input.find((item) => item.key === key);
    return items && items.values && !!items.values.filter(isNotEmptyString).length
        ? items.values
        : [];
};

const formatRate = (rate) => rate ? parseFloat((Number(rate) || 0).toFixed(2)) : null;

export const makeSuccessRatesObjects = (data = [[], [], [], []], start, end, pageBrand = '', deltaUserData = [], metricGroup) => {
    let minValue;
    const rateMetrics = getRateMetrics(metricGroup, pageBrand);
    return rateMetrics.map(({metricName, chartName}, i) => {
        const aggregatedData = [];
        const tempMinValue = (
            Array.isArray(data[i]) ? data[i] : []
        ).reduce((prev, {time, brandWiseSuccessRateData}) => {
            let localMin = prev;
            const momentTime = moment(time);
            const deltaUserCount = deltaUserData
                .find((item) => item.metricName === metricName)?.metricDeltaUserCounts
                .find((deltaUserItem) => momentTime.isSame(deltaUserItem.time))?.lobTotalDeltaUserCount;

            if (momentTime.isBetween(start, end, 'minutes', '[]')) {
                const found = aggregatedData.findIndex((d) => d.time === moment.utc(time).valueOf());

                if (found > -1) {
                    aggregatedData[found].value = formatRate(brandWiseSuccessRateData.rate);
                } else {
                    aggregatedData.push({
                        label: getTzFormat(momentTime, PAGE_VIEWS_DATE_FORMAT),
                        time: moment.utc(time).valueOf(),
                        value: formatRate(brandWiseSuccessRateData.rate),
                        totalDeltaUserCount: deltaUserCount
                    });
                }
            }

            return brandWiseSuccessRateData.rate ? Math.min(localMin, formatRate(brandWiseSuccessRateData.rate)) : localMin;
        }, (data[0] && data[0][0]) ? data[0][0].brandWiseSuccessRateData.rate : 0);

        if (i === 0) {
            minValue = tempMinValue;
        } else {
            minValue = Math.min(tempMinValue, minValue);
        }

        return {chartName, aggregatedData, pageBrand, metricName};
    }).map((item) => ({...item, minValue}));
};

export const getLobDeltaUserCount = (lobDeltaUserCount) => {
    const findLob = (eachDeltaUserCount) => (LOB_LIST.find((y) => y.value === eachDeltaUserCount.lineOfBusiness));
    return lobDeltaUserCount?.lobDeltaUserCounts?.map((x) => ({
        lineOfBusiness: findLob(x)?.label,
        deltaCount: x.deltaCount || 0
    }));
};

export const makeSuccessRatesLOBObjects = (
    data = [[], [], [], []],
    start,
    end,
    pageBrand = '',
    selectedBrand = '',
    lobs = [],
    deltaUserData,
    metricGroup
) => {
    let minValue;
    const rateMetrics = getRateMetrics(metricGroup, selectedBrand);
    const successRateFilter = ({brand, lineOfBusiness}) => (
        mapBrandNames(brand) === selectedBrand
        && (!lobs.length || !lineOfBusiness || lobs.findIndex(({value}) => value === lineOfBusiness) > -1)
    );

    const successRateEPSFilter = ({lineOfBusiness}) => (
        (!lobs.length || !lineOfBusiness || lobs.findIndex(({value}) => value === lineOfBusiness) > -1)
    );

    const getLobValueKey = (lineOfBusiness) => lineOfBusiness
        ? lobs.find(({value}) => value === lineOfBusiness)?.label
        : 'value';

    const getRate = (rate) => rate === null ? null : formatRate(rate);

    return rateMetrics.map(({metricName, chartName}, i) => {
        const aggregatedData = [];
        const tempMinValue = (
            Array.isArray(data[i]) ? data[i] : []
        ).reduce((prev, {time, successRatePercentagesData}) => {
            let localMin = prev;
            successRatePercentagesData
                .filter(selectedBrand === 'eps' ? successRateEPSFilter : successRateFilter)
                .forEach(({rate, lineOfBusiness}) => {
                    const momentTime = moment(time);
                    const deltaUserCount = deltaUserData
                        .find((item) => item.metricName === metricName)?.metricDeltaUserCounts
                        .find((deltaUserItem) => momentTime.isSame(deltaUserItem.time));
                    if (momentTime.isBetween(start, end, 'minutes', '[]')) {
                        const valueKey = getLobValueKey(lineOfBusiness);
                        const found = aggregatedData.findIndex((d) => d.time === moment.utc(time).valueOf());
                        if (found > -1) {
                            aggregatedData[found][valueKey] = getRate(rate);
                        } else {
                            aggregatedData.push({
                                label: getTzFormat(momentTime, PAGE_VIEWS_DATE_FORMAT),
                                time: moment.utc(time).valueOf(),
                                [valueKey]: getRate(rate),
                                totalDeltaUserCount: deltaUserCount?.lobTotalDeltaUserCount,
                                ['deltaUserCountByLob']: getLobDeltaUserCount(deltaUserCount)});
                        }
                    }

                    localMin = rate ? Math.min(localMin, formatRate(rate)) : localMin;
                });

            return localMin;
        }, (data[0] && data[0][0]) ? data[0][0].successRatePercentagesData.find((item) => mapBrandNames(item.brand) === selectedBrand).rate : 0);

        if (i === 0) {
            minValue = tempMinValue;
        } else {
            minValue = Math.min(tempMinValue, minValue);
        }

        return {chartName, aggregatedData, pageBrand, metricName};
    }).map((item) => ({...item, minValue}));
};

export const validDateRange = (start, end) => {
    const startMoment = moment(start);
    return !!start && !!end && startMoment.isBefore(new Date()) && startMoment.isBefore(end);
};

export const getQueryParams = (search) => {
    const {from, to, lobs, view, metric} = qs.parse(search, {decoder: (c) => c});
    const initialLobs = lobs
        ? lobs.split(',').map((l) => LOB_LIST.find(({value}) => value === l)).filter((l) => l)
        : [];

    const initialDateRangePickerValues = validDateRange(from, to)
        ? {
            initialStart: moment(from),
            initialEnd: moment(to),
            initialTimeRange: 'Custom',
        } : {
            initialStart: moment().subtract(6, 'hours').startOf('minute'),
            initialEnd: moment(),
            initialTimeRange: 'Last 6 Hours',
        };

    return {
        ...initialDateRangePickerValues,
        initialLobs,
        initialViewType: VIEW_TYPES.includes(view) ? view : SELECT_VIEW_LABEL,
        initialMetricGroup: PAGEVIEWS_METRICS.includes(metric) ? metric : SELECT_METRIC_LABEL
    };
};

export const getLobPlaceholder = (isLoading, lobWidgetsLength = 0) => {
    let placeholder;

    if (isLoading) {
        placeholder = 'Line of Business is loading';
    } else if (lobWidgetsLength) {
        placeholder = 'Select Line of Business';
    } else {
        placeholder = 'Line of Business Data not available. Try to refresh';
    }

    return placeholder;
};

const getNowDate = () => moment().endOf('minute').toDate();

const getLastDate = (value, unit) => moment().subtract(value, unit).startOf('minute').toDate();

export const getPresetValue = (value, unit) => ({start: getLastDate(value, unit), end: getNowDate()});

export const getPresets = () => [
    {text: 'Last 15 minutes', value: getPresetValue(15, 'minutes')},
    {text: 'Last 30 minutes', value: getPresetValue(30, 'minutes')},
    {text: 'Last 1 hour', value: getPresetValue(1, 'hour')},
    {text: 'Last 3 hours', value: getPresetValue(3, 'hours')},
    {text: 'Last 6 hours', value: getPresetValue(6, 'hours')},
    {text: 'Last 12 hours', value: getPresetValue(12, 'hours')},
    {text: 'Last 24 hours', value: getPresetValue(24, 'hours')}
];

export const getTableNumValue = (row, property) => row && property && row[property] !== null ? row[property] : '-';

export const getUrlParam = (label, value, defaultValue) => {
    return value && value !== defaultValue
        ? `&${label}=${encodeURIComponent(value)}`
        : '';
};

export const checkIsDateInvalid = (start, end) => (moment(end).diff(moment(start), 'days') >= 5) || (moment().diff(moment(end), 'minutes') > 5);

const getPredictionCount = (simplifiedPredictionData, item) => {
    let predictionCount = null;
    for (let predItem of simplifiedPredictionData) {
        if (predItem.time === item.time) {
            predictionCount = Math.round(predItem.count);
        }
    }
    return predictionCount;
};

export const getChartDataForFutureEvents = (dateInvalid, chartData, simplifiedPredictionData, chartDataForFutureEvents, finalChartData) => {
    if (!dateInvalid && chartData && chartData.length && chartData.length < simplifiedPredictionData.length) {
        chartDataForFutureEvents = chartData.map((item, i) => {
            const predictionCount = getPredictionCount(simplifiedPredictionData, item);
            if (item.time === chartData[i]?.time) {
                return {
                    ...item,
                    [BOOKING_COUNT]: chartData[i][BOOKING_COUNT],
                    ...(predictionCount && {[PREDICTION_COUNT]: predictionCount}),
                };
            }
            return {
                ...item,
                [BOOKING_COUNT]: 0,
                ...(predictionCount && {[PREDICTION_COUNT]: predictionCount}),
            };
        });

        return chartDataForFutureEvents;
    }

    return finalChartData;
};

export const getResetGraphTitle = (daysRange) => daysRange === DEFAULT_DAY_RANGE ? DISABLED_RESET_GRAPH_BUTTON : ENABLED_RESET_GRAPH_BUTTON;

export const getPageViewsGrafanaDashboardByBrand = (brand, type) => GRAFANA_DASHBOARDS.find((x) => x.brand === brand)?.[type] || '';

export const getSuccessRateGrafanaDashboard = (brand, metric) => {
    const brandDashboards = GRAFANA_DASHBOARDS.find((x) => x.brand === brand) || {};
    const successRatesUrl = (metric === LOGIN_RATES_LABEL)
        ? brandDashboards.loginSuccessRateUrl
        : brandDashboards.successRateUrl;
    return successRatesUrl || '';
};

export const brandsWithGrafanaDashboard = () => GRAFANA_DASHBOARDS.map((x) => x.brand) || [];

export const getQueryValues = (search) => {
    const {start, end} = qs.parse(search);
    const isValidDateRange = validDateRange(start, end);

    return {
        initialStart: isValidDateRange
            ? getTzFormat(start, DATE_FORMAT)
            : getTzFormat(moment().subtract(1, 'years').startOf('minute'), DATE_FORMAT),
        initialEnd: isValidDateRange
            ? getTzFormat(end, DATE_FORMAT)
            : getTzFormat(moment(), DATE_FORMAT)
    };
};

export const getAdjustedRefAreas = (refAreaLeft, refAreaRight) => {
    if (moment(refAreaLeft).isAfter(refAreaRight)) {
        // if refArea was dragged right to left
        return [refAreaRight, refAreaLeft];
    }
    return [refAreaLeft, refAreaRight];
};

export const isInvalidRange = (refAreaLeft, refAreaRight) => {
    const range = Math.abs(refAreaLeft - refAreaRight);
    const minRange = 200000;
    return refAreaRight === '' || refAreaLeft === '' || range < minRange;
};
