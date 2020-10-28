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
import {buildTicketLinks, divisionToBrand, getListOfUniqueProperties, isNotDuplicate} from '../utils';
import {formatDurationForTable, formatDurationToH, formatDurationToHours} from '../../components/utils';

export const getTableColumns = (selectedBrand) => {
    if (selectedBrand === EXPEDIA_PARTNER_SERVICES_BRAND) {
        return ['Incident', 'Priority', 'Division', 'Started', 'Summary', 'Impacted Partners', 'RC Owner', 'TTD', 'TTR', 'Notification Sent', 'Status'];
    } else if (selectedBrand === EG_BRAND) {
        return ['Incident', 'Priority', 'Brand', 'Division', 'Started', 'Summary', 'RC Owner', 'TTD', 'TTR', 'Status'];
    }
    return ['Incident', 'Priority', 'Division', 'Started', 'Summary', 'RC Owner', 'TTD', 'TTR', 'Status'];
};

export const getValue = (item, property, transformFn) => {
    if (!item || !item[property]) {
        return '-';
    }
    if (transformFn) {
        return transformFn(item[property]) || '-';
    }
    return item[property];
};

export const adjustTicketProperties = (tickets = [], type = 'incident') => {
    // eslint-disable-next-line complexity
    return tickets.map((t) => {
        const result = {
            ...t,
            startDate: t.startDate || t.openDate,
            Division: String(t.divisions || '') || t.brand,
            Status: t.status,
            'RC Owner': t.rootCauseOwner,
            Brand: t.impactedBrand
                ? t.impactedBrand.split(',').map((b) => divisionToBrand(b)).filter(isNotDuplicate).join(', ')
                : divisionToBrand(t.brand)
        };
        if (type === 'incident') {
            result.partner_divisions = t.divisions;
            result['Impacted Partners'] = t.impactedPartnersLobs;
            result['Notification Sent'] = t.notificationSent;
        } else if (type === 'defect') {
            result.duration = (t.openDate && t.resolvedDate)
                ? moment(t.resolvedDate).diff(t.openDate, 'milliseconds')
                : '';
        }
        return result;
    });
};

export const getIncidentsData = (filteredIncidents = []) => filteredIncidents
    .map((inc) => ({
        id: uuid(),
        Incident: buildTicketLinks(inc.id, inc.Brand, inc.url) || '-',
        Priority: getValue(inc, 'priority'),
        Brand: getValue(inc, 'Brand'),
        Division: getValue(inc, 'Division'),
        Started: moment.utc(inc.startDate).local().isValid() ? moment.utc(inc.startDate).local().format('YYYY-MM-DD HH:mm') : '-',
        Summary: getValue(inc, 'summary').trim(),
        Duration: getValue(inc, 'duration', formatDurationForTable),
        rawDuration: inc.duration,
        TTD: getValue(inc, 'timeToDetect', formatDurationForTable),
        rawTTD: inc.timeToDetect,
        TTR: getValue(inc, 'timeToResolve', formatDurationForTable),
        rawTTR: inc.timeToResolve,
        'Resolution Notes': getValue(inc, 'rootCause'),
        'Root Cause': getValue(inc, 'rootCause'),
        'Root Cause Owner': getValue(inc, 'rootCauseOwner'),
        Status: getValue(inc, 'Status'),
        Tag: getValue(inc, 'tag'),
        'Executive Summary': getValue(inc, 'executiveSummary'),
        executiveSummary: getValue(inc, 'executiveSummary'),
        'RC Owner': getValue(inc, 'rootCauseOwner'),
        'Impacted Brand': getValue(inc, 'impactedBrand'),
        'Owning Division': getValue(inc, 'Division'),
        partner_divisions: getValue(inc, 'divisions'),
        'Impacted Partners': getValue(inc, 'impactedPartnersLobs'),
        'Notification Sent': getValue(inc, 'notificationSent'),
        Details: (
            <div className="expandable-row-wrapper">
                <div className="expandable-row">
                    <span className="expandable-row-header">{'Incident Executive Summary:'}</span>
                    <div className="expandable-row-section">
                        {getValue(inc, 'executiveSummary')}
                    </div>
                </div>
                <div className="expandable-row">
                    <span className="expandable-row-header">{'Resolution Notes:'}</span>
                    <div className="expandable-row-section">
                        {getValue(inc, 'rootCause')}
                    </div>
                </div>
            </div>
        )
    }))
    .sort((a, b) => moment(a.Started).isBefore(b.Started));

export const getQualityData = (filteredDefects = []) => filteredDefects
    // eslint-disable-next-line complexity
    .map((t) => ({
        Defect: buildTicketLinks(t.id, t.Brand, t.url) || '-',
        Priority: getValue(t, 'priority'),
        Brand: getValue(t, 'Brand'),
        Division: getValue(t, 'Division'),
        Opened: moment.utc(t.openDate).local().isValid() ? moment(t.openDate).local().format('YYYY-MM-DD HH:mm') : '-',
        Resolved: moment.utc(t.resolvedDate).local().isValid() ? moment(t.resolvedDate).local().format('YYYY-MM-DD HH:mm') : '-',
        Duration: t.duration && t.resolvedDate ? formatDurationForTable(t.duration) : '-',
        Summary: getValue(t, 'summary'),
        Project: getValue(t, 'project'),
        rawDuration: t.duration,
        'Impacted Brand': getValue(t, 'impactedBrand'),
        Status: getValue(t, 'Status'),
        Tag: getValue(t, 'tag'),
    }))
    .sort((a, b) => moment(a.Opened).isBefore(b.Opened));

const brandIncidents = (incidents, brand) => incidents.filter((incident) => incident.Brand === brand);

export const incidentsOfTheWeek = (incidents, week = '') => incidents.filter(({startDate}) => moment(startDate).week() === week);

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
        const brandMTTR = formatDurationToHours(getMeanValue(brandIncidentsList, 'timeToResolve'));
        const brandMTTD = formatDurationToHours(getMeanValue(brandIncidentsList, 'timeToDetect'));
        const P1inc = brandIncidentsList.filter((incident) => incident.priority === '1-Critical').length;
        const P2inc = brandIncidentsList.filter((incident) => incident.priority === '2-High').length;
        const all = brandIncidentsList.length;
        const brandTotalDuration = formatDurationToHours(sumPropertyInArrayOfObjects(brandIncidentsList, 'duration'));

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
    getMeanValue(incidentsOfTheWeek(incidents, moment(date).week()), property)
));

export const weeklyMTTRMTTD = (startDate, endDate, incidents = []) => {
    const data = [];
    const weeksInterval = getWeeks(startDate, endDate);
    weeksInterval.forEach((date) => {
        data.push({
            name: date,
            MTTR: getMeanHours(incidents, date, 'timeToResolve'),
            MTTD: getMeanHours(incidents, date, 'timeToDetect')
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
