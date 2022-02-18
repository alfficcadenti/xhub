import React from 'react';
import {renderToString} from 'react-dom/server';
import moment from 'moment/moment';
import uuid from 'uuid/v1';
import {
    BRANDS,
    DATE_FORMAT,
    EG_BRAND,
    EGENCIA_BRAND,
    EXPEDIA_BRAND,
    EXPEDIA_PARTNER_SERVICES_BRAND,
    HOTELS_COM_BRAND,
    VRBO_BRAND
} from '../../constants';
import {getOrDefault} from '../../utils';
import {buildTicketLinks, divisionToBrand, getListOfUniqueProperties, isNotDuplicate} from '../utils';
import {formatDurationForTable, formatDurationToH, formatDuration} from '../../components/utils';

export const getTableColumns = (selectedBrand) => {
    if (selectedBrand === EXPEDIA_PARTNER_SERVICES_BRAND) {
        return ['Incident', 'Priority', 'Division', 'Started', 'Summary', 'Impacted Partners', 'RC Owner', 'TTD', 'TTK', 'TTF', 'TTR', 'Notification Sent', 'Status', 'Success Rates', 'Page Views'];
    } else if (selectedBrand === EG_BRAND) {
        return ['Incident', 'Priority', 'Brand', 'Division', 'Started', 'Summary', 'RC Owner', 'TTD', 'TTK', 'TTF', 'TTR', 'Status', 'Success Rates', 'Page Views'];
    }
    return ['Incident', 'Priority', 'Division', 'Started', 'Summary', 'RC Owner', 'TTD', 'TTK', 'TTF', 'TTR', 'Status', 'Success Rates', 'Page Views'];
};

export const adjustTicketProperties = (tickets = []) => (
    // eslint-disable-next-line complexity
    tickets.map((t) => {
        const result = {
            ...t,
            start_date: t.start_date || t.open_date,
            Division: String(t.divisions || '') || t.brand,
            Status: t.status,
            'RC Owner': t.root_cause_owner,
            Brand: t.impacted_brand
                ? t.impacted_brand.split(',').map((b) => divisionToBrand(b)).filter(isNotDuplicate).join(', ')
                : divisionToBrand(t.brand)
        };
        result.partner_divisions = t.divisions;
        result['Impacted Partners'] = t.impacted_partners_lobs;
        result['Notification Sent'] = t.notification_sent;
        if (!result.duration) {
            result.duration = (t.open_date && t.resolved_date)
                ? moment(t.resolved_date).diff(t.open_date, 'milliseconds')
                : '';
        }
        return result;
    })
);

export const getUrlParams = (brand, incStart) => {
    const start = moment(incStart);
    return `?selectedBrand=${brand}`
        + `&from=${encodeURIComponent(start.subtract(2, 'hours').startOf('hour').format())}`
        + `&to=${encodeURIComponent(start.add(3, 'hours').startOf('hour'))}`;
};

export const formatMomentInLocalDateTime = (momentDate) => moment.utc(momentDate || '').local().isValid() && moment.utc(momentDate).local().format('YYYY-MM-DD HH:mm');

export const getIncidentsData = (filteredIncidents = []) => filteredIncidents
    .map((inc) => ({
        id: uuid(),
        Incident: buildTicketLinks(inc.id, inc.Brand, inc.url) || '-',
        Priority: getOrDefault(inc, 'priority'),
        Brand: getOrDefault(inc, 'Brand'),
        Division: getOrDefault(inc, 'Division'),
        Started: getOrDefault(inc, 'start_date', '-', formatMomentInLocalDateTime),
        Summary: getOrDefault(inc, 'summary').trim(),
        Duration: getOrDefault(inc, 'duration', '-', formatDurationForTable),
        rawDuration: inc.duration,
        TTD: getOrDefault(inc, 'time_to_detect', '-', formatDurationForTable, 'minutes'),
        TTK: getOrDefault(inc, 'time_to_know', '-', formatDurationForTable, 'minutes'),
        TTF: getOrDefault(inc, 'time_to_fix', '-', formatDurationForTable, 'minutes'),
        TTR: getOrDefault(inc, 'time_to_restore', '-', formatDurationForTable, 'minutes'),
        'Resolution Notes': getOrDefault(inc, 'root_cause'),
        'Root Cause': getOrDefault(inc, 'root_cause'),
        'Root Cause Owner': getOrDefault(inc, 'root_cause_owner'),
        Status: getOrDefault(inc, 'Status'),
        'Executive Summary': getOrDefault(inc, 'executive_summary'),
        executiveSummary: getOrDefault(inc, 'executiveSummary'),
        'RC Owner': getOrDefault(inc, 'root_cause_owner'),
        'Impacted Brand': getOrDefault(inc, 'impacted_brand'),
        'Owning Division': getOrDefault(inc, 'Division'),
        partner_divisions: getOrDefault(inc, 'divisions'),
        'Impacted Partners': getOrDefault(inc, 'impacted_partners_lobs'),
        'Notification Sent': getOrDefault(inc, 'notification_sent'),
        'Success Rates': <a href={`/success-rates${getUrlParams(inc.Brand, inc.start_date)}`} target="_blank" >{'View'}</a>,
        'Page Views': <a href={`/funnel-view${getUrlParams(inc.Brand, inc.start_date)}`} target="_blank" >{'View'}</a>,
        Details: (
            <div className="expandable-row-wrapper">
                <div className="expandable-row">
                    <span className="expandable-row-header">{'Incident Executive Summary:'}</span>
                    <div className="expandable-row-section">
                        {getOrDefault(inc, 'executive_summary')}
                    </div>
                </div>
                <div className="expandable-row">
                    <span className="expandable-row-header">{'Resolution Notes:'}</span>
                    <div className="expandable-row-section">
                        {getOrDefault(inc, 'root_cause')}
                    </div>
                </div>
            </div>
        )
    }))
    .sort((a, b) => b.Started.localeCompare(a.Started));


export const formatObjectFromIncident = (inc = {}) => {
    const incObj = {
        'ID': getOrDefault(inc, 'id'),
        'Priority': getOrDefault(inc, 'priority'),
        'L1': getOrDefault(inc, 'brand'),
        'Started': getOrDefault(inc, 'startDate', '-', formatMomentInLocalDateTime),
        'Description': getOrDefault(inc, 'description'),
        'TTD': getOrDefault(inc, 'timeToDetect', '-', formatDuration, 'minutes'),
        'TTK': getOrDefault(inc, 'timeToKnow', '-', formatDuration, 'minutes'),
        'TTF': getOrDefault(inc, 'timeToFix', '-', formatDuration, 'minutes'),
        'TTR': getOrDefault(inc, 'timeToRestore', '-', formatDuration, 'minutes'),
        'Resolution Notes': getOrDefault(inc, 'rootCause'),
        'RC Owner': getOrDefault(inc, 'rootCauseOwner'),
        'Environment': getOrDefault(inc, 'environment'),
        'Booking Impact': getOrDefault(inc, 'bookingImpact'),
        'Executive Summary': getOrDefault(inc, 'executiveSummary')
    };
    return incObj;
};

export const getQualityData = (filteredDefects = []) => filteredDefects
    // eslint-disable-next-line complexity
    .map((t) => ({
        Defect: buildTicketLinks(t.id, t.Brand, t.url) || '-',
        Priority: getOrDefault(t, 'priority'),
        Brand: getOrDefault(t, 'Brand'),
        Division: getOrDefault(t, 'Division'),
        Opened: getOrDefault(t, 'open_date', '-', formatMomentInLocalDateTime),
        Resolved: moment.utc(t.resolved_date).local().isValid() ? moment(t.resolved_date).local().format('YYYY-MM-DD HH:mm') : '-',
        Duration: t.duration && t.resolved_date ? formatDurationForTable(t.duration) : '-',
        Summary: getOrDefault(t, 'summary'),
        Project: getOrDefault(t, 'project'),
        rawDuration: t.duration,
        'Impacted Brand': getOrDefault(t, 'impacted_brand'),
        Status: getOrDefault(t, 'Status')
    }))
    .sort((a, b) => moment(a.Opened).isBefore(b.Opened));

const brandIncidents = (incidents, brand) => incidents.filter((incident) => incident.Brand === brand);

export const incidentsOfTheWeek = (incidents, week = '') => incidents.filter(({start_date: startDate}) => moment(startDate).week() === week);

export const sumPropertyInArrayOfObjects = (incidents = [], propertyToSum) =>
    incidents.reduce((acc, curr) => {
        const value = Number(curr[propertyToSum]);
        const numValue = Number.isNaN(value) ? 0 : value;
        return acc + numValue;
    }, 0);

export const getMeanValue = (incidents = [], property) => (sumPropertyInArrayOfObjects(incidents, property) / incidents.length) || 0;

export const getIncMetricsByBrand = (inc = []) => getListOfUniqueProperties(inc, 'Brand')
    .map((brand) => {
        const brandIncidentsList = brandIncidents(inc, brand);
        const brandMTTR = formatDuration(getMeanValue(brandIncidentsList, 'time_to_restore'), 'minutes');
        const brandMTTD = formatDuration(getMeanValue(brandIncidentsList, 'time_to_detect'), 'minutes');
        const P1inc = brandIncidentsList.filter((incident) => incident.priority === '1-Critical').length;
        const P2inc = brandIncidentsList.filter((incident) => incident.priority === '2-High').length;
        const all = brandIncidentsList.length;
        const brandTotalDuration = formatDuration(sumPropertyInArrayOfObjects(brandIncidentsList, 'duration'));

        return {
            'Brand': brand,
            'P1': P1inc,
            'P2': P2inc,
            'All': all,
            'MTTD': brandMTTD,
            'MTTR': brandMTTR,
            'Total Duration': brandTotalDuration
        };
    });

export const getWeeks = (start = '', end = '') => {
    const weeks = [];
    const current = moment(start).startOf('week');
    while (current.isSameOrBefore(end)) {
        weeks.push(current.format(DATE_FORMAT));
        current.add(7, 'days');
    }
    return weeks;
};

export const getMeanHours = (incidents, date, property) => Number.parseFloat(formatDurationToH(
    getMeanValue(incidentsOfTheWeek(incidents, moment(date).week()), property), 'minutes'
));

export const weeklyMTTRMTTD = (startDate, endDate, incidents = []) => {
    const data = [];
    const weeksInterval = getWeeks(startDate, endDate);
    weeksInterval.forEach((date) => {
        data.push({
            name: date,
            MTTR: getMeanHours(incidents, date, 'time_to_restore'),
            MTTD: getMeanHours(incidents, date, 'time_to_detect')
        });
    });
    return {data, keys: ['MTTR', 'MTTD']};
};

export const weeklyMeanTimebyBrand = (startDate, endDate, incidents = [], brand, property) => {
    const data = [];
    const weeksInterval = getWeeks(startDate, endDate);
    const brandDelimiter = ', ';
    const keys = brand === EG_BRAND
        ? getListOfUniqueProperties(incidents.map((inc) => {
            const mappedInc = JSON.parse(JSON.stringify(inc));
            mappedInc.Brand = mappedInc.Brand.split(brandDelimiter);
            return mappedInc;
        }), 'Brand')
        : [brand];
    weeksInterval.forEach((date) => {
        const result = {name: date};
        incidents.forEach((inc) => {
            inc.Brand.split(brandDelimiter).forEach((b) => {
                if (keys.includes(b)) {
                    result[b] = getMeanHours(brandIncidents(incidents, b), date, property);
                }
            });
        });
        data.push(result);
    });
    return {data, keys};
};

export const sortInAscOrderAndGetTop5 = (incidents, fieldToSort) => incidents
    .sort((a, b) => Number(a[fieldToSort]) - Number(b[fieldToSort]))
    .slice(0, 5);

export const sortInDescOrderAndGetTop5 = (incidents, fieldToSort) => incidents
    .sort((a, b) => Number(b[fieldToSort]) - Number(a[fieldToSort]))
    .slice(0, 5);

const filterIncidentsPerInterval = (data = [], filter, propertyToSum) => {
    const propertyToSort = 'lostRevenue';
    const filteredByImpactedBrand = data.filter(filter);
    const uniqueIds = getListOfUniqueProperties(filteredByImpactedBrand, 'id');

    const tooltipEntryData = uniqueIds.reduce((prev, incId) => {
        const link = buildTicketLinks(incId);
        const incidentsFilteredByUniqueNumber = filteredByImpactedBrand
            .filter(({id}) => id === incId);
        const lostRevenue = sumPropertyInArrayOfObjects(incidentsFilteredByUniqueNumber, propertyToSum);

        const tooltipEntry = {
            link: renderToString(link),
            lostRevenue
        };

        return [
            ...prev,
            tooltipEntry
        ];
    }, []);

    return sortInDescOrderAndGetTop5(tooltipEntryData, propertyToSort);
};

const buildRawSeriesForFinancialImpact = (keys, filterKey, weekIntervals, incidentsPerIntervalMap, propertyToSum) => {
    return weekIntervals.map((w) => {
        const interval = {name: w};
        keys.forEach((key) => {
            const incidents = incidentsPerIntervalMap[w].filter((incident) => incident[filterKey].includes(key));
            interval[key] = sumPropertyInArrayOfObjects(incidents, propertyToSum);
        });
        return interval;
    });
};

const buildFinancialImpactTooltipData = (keys, filterKey, weekIntervals, incidentsPerIntervalMap, propertyToSum) => weekIntervals
    .reduce((prev, weekInterval) => {
        const newMetricPoint = keys.reduce((map, key) => ({
            ...map,
            [key]: filterIncidentsPerInterval(incidentsPerIntervalMap[weekInterval], (incident) => incident[filterKey].includes(key), propertyToSum)
        }), {});

        return {
            ...prev,
            [weekInterval]: newMetricPoint
        };
    }, {});

export const buildFinancialImpactData = (incidents, startDate, endDate, selectedBrand, propertyToSum) => {
    const weekIntervals = getWeeks(startDate, endDate);
    const filterKey = selectedBrand === EG_BRAND
        ? 'Brand'
        : 'Division';
    const keys = selectedBrand === EG_BRAND
        ? BRANDS.map((b) => b.label)
        : getListOfUniqueProperties(incidents, 'Division');
    const incidentsPerIntervalHash = weekIntervals
        .reduce((acc, weekInterval) => ({
            ...acc,
            [weekInterval]: incidentsOfTheWeek(incidents, moment(weekInterval).week())
        }), {});
    return {
        data: buildRawSeriesForFinancialImpact(keys, filterKey, weekIntervals, incidentsPerIntervalHash, propertyToSum),
        keys,
        tooltipData: buildFinancialImpactTooltipData(keys, filterKey, weekIntervals, incidentsPerIntervalHash, propertyToSum)
    };
};

export const getWeeklyCounts = (startDate, endDate, tickets, key) => {
    const weeks = getWeeks(startDate, endDate);
    const data = weeks.map((w) => ({name: w, count: 0}));
    tickets.forEach((ticket) => {
        const date = moment(ticket[key]).startOf('week').format(DATE_FORMAT);
        const idx = data.findIndex(({name}) => name === date);
        if (idx > -1) {
            data[idx].count++;
        }
    });
    return {data, keys: ['count']};
};

// eslint-disable-next-line complexity
export const impactedBrandToDivision = (impactedBrand = '') => {
    switch (impactedBrand && impactedBrand.toUpperCase()) {
        case 'EGENCIA NA':
        case 'EGENCIA EU':
        case 'EGENCIA EU, EGENCIA NA':
            return EGENCIA_BRAND;
        case 'VRBO':
            return VRBO_BRAND;
        case 'EXPEDIA':
            return EXPEDIA_BRAND;
        case 'HOTELS':
            return HOTELS_COM_BRAND;
        case 'EXPEDIA PARTNER SOLUTIONS':
        case 'EAN':
        case 'EXPEDIA PARTNER SERVICES':
        case 'EPS':
            return EXPEDIA_PARTNER_SERVICES_BRAND;
        default:
            return '';
    }
};
