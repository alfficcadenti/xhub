import React from 'react';
import {
    BRANDS,
    EGENCIA_BRAND,
    EXPEDIA_BRAND,
    EXPEDIA_PARTNER_SERVICES_BRAND,
    HOTELS_COM_BRAND,
    LOB_LIST,
    PAGE_VIEWS_DATE_FORMAT,
    SUCCESS_RATES_PAGES_LIST,
    TIMEZONE_ABBR,
    VRBO_BRAND
} from '../constants';
import {METRIC_NAMES} from './SuccessRates/constants';
import ALL_PAGES from './index';
import qs from 'query-string';
import moment from 'moment';
import {
    ENABLED_RESET_GRAPH_BUTTON,
    DISABLED_RESET_GRAPH_BUTTON
} from './Impulse/constants';
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

export const consolidateTicketsById = (tickets) => {
    const results = [];
    const ticketIdSet = new Set();
    // eslint-disable-next-line complexity
    tickets.forEach((ticket) => {
        const {id} = ticket;
        if (!id) {
            return;
        }
        const ids = id.split(',');
        if (ids.some((i) => ticketIdSet.has(i))) {
            const found = results.find((t) => ids.some((i) => t.id && t.id.split(',').some((j) => i === j)));
            if (found.impactedBrand && ticket.impactedBrand && !found.impactedBrand.split(',').some((b) => ticket.impactedBrand.split(',').includes(b))) {
                found.impactedBrand += `,${ticket.impactedBrand}`;
            }
            const foundIds = found.id.split(',');
            ids.forEach((i) => {
                if (!foundIds.includes(i)) {
                    found.id = `${found.id},${i}`;
                }
            });
            if (ticket.divisions && !found.divisions) {
                found.divisions = ticket.divisions;
            } else if (ticket.divisions && ticket.divisions.length) {
                ticket.divisions.forEach((d) => {
                    if (!found.divisions.includes(d)) {
                        found.divisions.push(d);
                    }
                });
            }
            found.estimatedRevenueLoss = `${parseFloat(found.estimatedRevenueLoss) + parseFloat(ticket.estimatedRevenueLoss || 0)}`;
            found.estimatedGrossLoss = `${parseFloat(found.estimatedGrossLoss) + parseFloat(ticket.estimatedGrossLoss || 0)}`;
        } else {
            results.push(ticket);
        }
        ids.forEach((i) => ticketIdSet.add(i));
    });
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
    // eslint-disable-next-line no-unused-vars
    for (let [key, val] of Object.entries(group)) {
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
        return (<a href={url} target="_blank">{id}</a>);
    }
    const brandInUppercase = brand && brand.toUpperCase();
    const brandUrl = brandInUppercase === VRBO_BRAND.toUpperCase() ? `https://jira.homeawaycorp.com/browse/${id}` : `https://expedia.service-now.com/go.do?id=${id}`;
    return (<a href={brandUrl} target="_blank">{id}</a>);
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

export const parseDurationToMs = (strDuration = '') => {
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
    return totalMinutes * 60000;
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
    result.brand = EXPEDIA_PARTNER_SERVICES_BRAND;
    result.impactedBrand = EXPEDIA_PARTNER_SERVICES_BRAND;
    result.duration = parseDurationToMs(t.duration);
    result.timeToDetect = parseDurationToMs(t.timeToDetect);
    result.timeToResolve = parseDurationToMs(t.timeToResolve);
    result.impactedPartners = getImpactedPartners(t.impactedPartners);
    result.impactedPartnersLobs = getImpactedPartners(t.impactedPartners, t.impactedLobs || []);
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

export const makeSuccessRatesObjects = (data = [[], [], [], []], start, end, pageBrand = '', deltaUserData = []) => {
    let minValue;

    const formatRate = (rate) => parseFloat((Number(rate) || 0).toFixed(2));
    // eslint-disable-next-line complexity
    return SUCCESS_RATES_PAGES_LIST.map((chartName, i) => {
        const aggregatedData = [];
        let metricName = '';
        let tempMinValue = 0;

        // eslint-disable-next-line complexity
        tempMinValue = (
            Array.isArray(data[i]) ? data[i] : []
        ).reduce((prev, {time, brandWiseSuccessRateData}) => {
            let localMin = prev;
            const momentTime = moment(time);
            metricName = METRIC_NAMES[i];
            const deltaUserCount = deltaUserData
                .find((item) => item.metricName === METRIC_NAMES[i])?.metricDeltaUserCounts
                .find((deltaUserItem) => momentTime.isSame(deltaUserItem.time))?.lobTotalDeltaUserCount;

            if (momentTime.isBetween(start, end, 'minutes', '[]')) {
                const found = aggregatedData.findIndex((d) => d.time === moment.utc(time).valueOf());

                if (found > -1) {
                    aggregatedData[found].value = brandWiseSuccessRateData.rate === null ? null : formatRate(brandWiseSuccessRateData.rate);
                } else {
                    aggregatedData.push({
                        label: `${momentTime.format(PAGE_VIEWS_DATE_FORMAT)} ${TIMEZONE_ABBR}`,
                        time: moment.utc(time).valueOf(),
                        value: brandWiseSuccessRateData.rate === null ? null : formatRate(brandWiseSuccessRateData.rate),
                        deltaUserCount
                    });
                }
            }

            localMin = brandWiseSuccessRateData.rate ? Math.min(localMin, formatRate(brandWiseSuccessRateData.rate)) : localMin;

            return localMin;
        }, (data[0] && data[0][0]) ? data[0][0].brandWiseSuccessRateData.rate : 0);

        if (i === 0) {
            minValue = tempMinValue;
        } else {
            minValue = tempMinValue < minValue ? tempMinValue : minValue;
        }

        return {chartName, aggregatedData, pageBrand, metricName};
    }).map((item) => ({...item, minValue}));
};

export const makeSuccessRatesLOBObjects = (
    data = [[], [], [], []],
    start,
    end,
    pageBrand = '',
    selectedBrand = '',
    lobs = [],
    deltaUserData
) => {
    let minValue;
    let metricName = '';
    const successRateFilter = ({brand, lineOfBusiness}) => (
        mapBrandNames(brand) === selectedBrand
        && (!lobs.length || !lineOfBusiness || lobs.findIndex(({value}) => value === lineOfBusiness) > -1)
    );

    const successRateEPSFilter = ({lineOfBusiness}) => (
        (!lobs.length || !lineOfBusiness || lobs.findIndex(({value}) => value === lineOfBusiness) > -1)
    );
    const formatRate = (rate) => parseFloat((Number(rate) || 0).toFixed(2));
    // eslint-disable-next-line complexity
    return SUCCESS_RATES_PAGES_LIST.map((chartName, i) => {
        const aggregatedData = [];
        let tempMinValue = 0;

        // eslint-disable-next-line complexity
        tempMinValue = (
            Array.isArray(data[i]) ? data[i] : []
        ).reduce((prev, {time, successRatePercentagesData}) => {
            let localMin = prev;
            metricName = METRIC_NAMES[i];
            successRatePercentagesData
                .filter(selectedBrand === 'eps' ? successRateEPSFilter : successRateFilter)
            // eslint-disable-next-line complexity
                .forEach(({rate, lineOfBusiness}) => {
                    const momentTime = moment(time);
                    const deltaUserCount = deltaUserData.find((item) => item.metricName === METRIC_NAMES[i])?.metricDeltaUserCounts
                        .find((deltaUserItem) => {
                            return momentTime.isSame(deltaUserItem.time);
                        })?.lobDeltaUserCounts
                        .find((item) => {
                            return item.lineOfBusiness === 'H';
                        })
                        .deltaCount;

                    if (momentTime.isBetween(start, end, 'minutes', '[]')) {
                        const lob = lineOfBusiness ? lobs.find(({value}) => value === lineOfBusiness) : null;
                        const valueKey = lob ? lob.label : 'value';
                        const found = aggregatedData.findIndex((d) => d.time === moment.utc(time).valueOf());

                        if (found > -1) {
                            aggregatedData[found][valueKey] = rate === null ? null : formatRate(rate);
                        } else {
                            aggregatedData.push({
                                label: `${momentTime.format(PAGE_VIEWS_DATE_FORMAT)} ${TIMEZONE_ABBR}`,
                                time: moment.utc(time).valueOf(),
                                [valueKey]: rate === null ? null : formatRate(rate),
                                [`${valueKey}deltaUserCount`]: deltaUserCount
                            });
                        }
                    }

                    localMin = rate ? Math.min(localMin, formatRate(rate)) : localMin;
                });

            return localMin;
        }, (data[0] && data[0][0]) ? data[0][0].successRatePercentagesData.find((item) => mapBrandNames(item.brand) === selectedBrand).rate : 0);

        if (i === 0) {
            minValue = tempMinValue;
        } else {
            minValue = tempMinValue < minValue ? tempMinValue : minValue;
        }

        return {chartName, aggregatedData, pageBrand, metricName};
    }).map((item) => ({...item, minValue}));
};

// eslint-disable-next-line complexity
export const validDateRange = (start, end) => {
    if (!start || !end) {
        return false;
    }
    const startMoment = moment(start);
    const endMoment = moment(end);
    return startMoment.isValid() && endMoment.isValid() && startMoment.isBefore(new Date()) && endMoment.isAfter(startMoment);
};

export const getQueryParams = (search) => {
    const {from, to, lobs} = qs.parse(search, {decoder: (c) => c});
    const initialLobs = lobs
        ? lobs.split(',').map((l) => LOB_LIST.find(({value}) => value === l)).filter((l) => l)
        : [];

    return validDateRange(from, to)
        ? {
            initialStart: moment(from),
            initialEnd: moment(to),
            initialTimeRange: 'Custom',
            initialLobs
        } : {
            initialStart: moment().subtract(6, 'hours').startOf('minute'),
            initialEnd: moment(),
            initialTimeRange: 'Last 6 Hours',
            initialLobs
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

export const getValue = (value, unit) => ({start: getLastDate(value, unit), end: getNowDate()});

export const getPresets = () => [
    {text: 'Last 15 minutes', value: getValue(15, 'minutes')},
    {text: 'Last 30 minutes', value: getValue(30, 'minutes')},
    {text: 'Last 1 hour', value: getValue(1, 'hour')},
    {text: 'Last 3 hours', value: getValue(3, 'hours')},
    {text: 'Last 6 hours', value: getValue(6, 'hours')},
    {text: 'Last 12 hours', value: getValue(12, 'hours')},
    {text: 'Last 24 hours', value: getValue(24, 'hours')}
];

export const getTableValue = (row, property) => row && property ? row[property] || '-' : '-';

export const getUrlParam = (label, value, defaultValue) => {
    return value && value !== defaultValue
        ? `&${label}=${encodeURIComponent(value)}`
        : '';
};

export const checkIsDateInvalid = (start, end) => (moment(end).diff(moment(start), 'days') >= 5) || (moment().diff(moment(end), 'minutes') > 5);

export const getChartDataForFutureEvents = (dateInvalid, chartData, simplifiedPredictionData, chartDataForFutureEvents, simplifiedBookingsData, finalChartData) => {
    if (!dateInvalid && chartData && chartData.length && chartData.length < simplifiedPredictionData.length) {
        chartDataForFutureEvents = simplifiedBookingsData.map((item, i) => {
            let predictionCount = null;
            for (let predItem of simplifiedPredictionData) {
                if (predItem.time === item.time) {
                    predictionCount = Math.round(predItem.count);
                }
            }

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
