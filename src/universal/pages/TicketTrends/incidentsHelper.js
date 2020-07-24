/* eslint-disable complexity */
/* eslint-disable  no-use-before-define */
/* eslint-disable no-shadow */

import React from 'react';
import {renderToString} from 'react-dom/server';
import moment from 'moment/moment';
import {isArray} from 'util';
import uuid from 'uuid/v1';
import * as h from '../../components/utils/formatDate';
import {DATE_FORMAT} from '../../constants';
import {VRBO_BRAND, HOTELS_COM_BRAND, EXPEDIA_BRAND, EGENCIA_BRAND} from '../../constants';

export const adjustTicketProperties = (tickets = [], type = 'incident') => {
    return tickets.map((t) => {
        const result = {
            ...t,
            'startedAt': t.startedAt ? t.startedAt : t.openDate,
            'Brand': divisionToBrand(t.brand),
            'Division': t.brand,
            'Status': t.status,
            'RC Owner': t.rootCauseOwner
        };
        if (type === 'incident') {
            result.ticket_summary = t.incidentSummary;
            result.ticket_number = t.incidentNumber;
            result.duration = t.duration && t.resolvedDate ? t.duration : null;
            result.ttr = t.ttr && t.resolvedDate ? t.ttr : null;
        } else if (type === 'defect') {
            result.ticket_summary = t.defectSummary;
            result.ticket_number = t.defectNumber;
            result.duration = (t.openDate && t.resolvedDate)
                ? moment(t.resolvedDate).diff(t.openDate, 'milliseconds')
                : '';
        }
        return result;
    });
};

export const divisionToBrand = (division = '') => {
    switch (division.toUpperCase()) {
        case 'EGENCIA - CONSOLIDATED':
        case 'EGENCIA':
            return EGENCIA_BRAND;
        case 'VRBO':
        case 'HOME AWAY':
            return VRBO_BRAND;
        case 'HOTELS WORLDWIDE (HWW)':
        case 'HCOM':
            return HOTELS_COM_BRAND;
        default:
            return EXPEDIA_BRAND;
    }
};

export const getUniqueTickets = (tickets, property) => {
    const group = tickets.reduce((acc, item) => {
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

const buildTicketLink = (id = '', brand = '', url = '') => {
    if (url) {
        return (`<a href="${url}" target="_blank">${id}</a>`);
    }
    const brandUrl = brand === VRBO_BRAND ? url : `https://expedia.service-now.com/go.do?id=${id}`;
    return (`<a href="${brandUrl}" target="_blank">${id}</a>`);
};

export const getIncidentsData = (filteredIncidents = []) => filteredIncidents
    .map((inc) => ({
        id: uuid(),
        Incident: buildTicketLink(inc.ticket_number, inc.Brand, inc.url) || '-',
        Priority: inc.priority || '-',
        Brand: inc.Brand || '-',
        Division: inc.Division || '-',
        Started: moment.utc(inc.startedAt).local().isValid() ? moment.utc(inc.startedAt).local().format('YYYY-MM-DD HH:mm') : '-',
        Summary: inc.ticket_summary || '-',
        Duration: inc.duration ? h.formatDurationForTable(inc.duration) : '-',
        rawDuration: inc.duration,
        TTD: inc.ttd ? h.formatDurationForTable(inc.ttd) : '-',
        rawTTD: inc.ttd,
        TTR: inc.ttr ? h.formatDurationForTable(inc.ttr) : '-',
        rawTTR: inc.ttr,
        'Resolution Notes': inc.rootCause || '-',
        'Root Cause': inc.rootCause || '-',
        'Root Cause Owner': inc.rootCauseOwner || '-',
        Status: inc.Status || '-',
        Tag: inc.tag || '-',
        'Executive Summary': inc.executiveSummary || '-',
        executiveSummary: inc.executiveSummary || '-',
        'RC Owner': inc.rootCauseOwner || '-',
        Details: (
            <div className="expandable-row-wrapper">
                <div className="expandable-row">
                    <span className="expandable-row-header">{'Incident Executive Summary:'}</span>
                    <div className="expandable-row-section">
                        {inc.executiveSummary || '-'}
                    </div>
                </div>
                <div className="expandable-row">
                    <span className="expandable-row-header">{'Resolution Notes:'}</span>
                    <div className="expandable-row-section">
                        {inc.rootCause || '-'}
                    </div>
                </div>
            </div>
        )
    }))
    .sort((a, b) => moment(a.Started).isBefore(b.Started));

export const getQualityData = (filteredDefects = []) => filteredDefects
    .map((t) => ({
        Defect: buildTicketLink(t.ticket_number, t.Brand, t.url) || '-',
        Priority: t.priority || '-',
        Brand: t.Brand || '-',
        Division: t.Division || '-',
        Opened: moment.utc(t.openDate).local().isValid() ? moment(t.openDate).local().format('YYYY-MM-DD HH:mm') : '-',
        Resolved: moment.utc(t.resolvedDate).local().isValid() ? moment(t.resolvedDate).local().format('YYYY-MM-DD HH:mm') : '-',
        Summary: t.ticket_summary || '-',
        Project: t.project || '-',
        Duration: t.duration && t.resolvedDate ? h.formatDurationForTable(t.duration) : '-',
        rawDuration: t.duration,
        'Impacted Brand': t.impactedBrand || '-',
        Status: t.Status || '-',
        Tag: t.tag || '-',
    }))
    .sort((a, b) => moment(a.Opened).isBefore(b.Opened));

export const getListOfUniqueProperties = (incidents = [], prop) => {
    let isArray = false;
    // extract property value from tickets & determine if it's of type array
    const values = incidents.map((incident) => {
        const value = incident[prop];
        isArray = isArray || Array.isArray(value);
        return value;
    });
    if (!isArray) {
        // filter empty strings and duplicates
        return values.filter((value, index, self) => value && self.indexOf(value) === index);
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

const max = (accumulator, currentValue) => (currentValue > accumulator ? currentValue : accumulator);
const min = (accumulator, currentValue) => (currentValue < accumulator ? currentValue : accumulator);

export const getMarginDateValues = (incidents = []) => {
    const dates = incidents.map((incident) => moment(incident.startedAt));

    return dates.length === 0 || !isArray(dates) ?
        [] :
        [
            moment(dates.reduce(min)).format(DATE_FORMAT),
            moment(dates.reduce(max)).format(DATE_FORMAT)
        ];
};

const brandIncidents = (incidents, brand) => incidents.filter((incident) => incident.Brand === brand);

export const incidentsOfTheWeek = (incidents, week = '') => incidents.filter(({startedAt}) => moment(startedAt).week() === week);

export const getIncMetricsByBrand = (inc = []) => getListOfUniqueProperties(inc, 'Brand')
    .map((brand) => {
        const brandIncidentsList = brandIncidents(inc, brand);
        const brandMTTR = h.formatDurationToHours(mttr(brandIncidentsList));
        const brandMTTD = h.formatDurationToHours(mttd(brandIncidentsList));
        const P1inc = brandIncidentsList.filter((incident) => incident.priority === '1-Critical').length;
        const P2inc = brandIncidentsList.filter((incident) => incident.priority === '2-High').length;
        const all = brandIncidentsList.length;
        const brandTotalDuration = h.formatDurationToHours(sumPropertyInArrayOfObjects(brandIncidentsList, 'duration'));

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

export const listOfIncByBrands = (inc = []) => getListOfUniqueProperties(inc, 'Brand')
    .map((brand) => brandIncidents(inc, brand));

export const sumPropertyInArrayOfObjects = (incidents = [], propertyToSum) =>
    incidents.reduce((acc, curr) => (acc + Number(curr[propertyToSum])), 0);

export const mttr = (incidents = []) => (sumPropertyInArrayOfObjects(incidents, 'ttr') / incidents.length) || 0;
const mttd = (incidents = []) => (sumPropertyInArrayOfObjects(incidents, 'ttd') / incidents.length) || 0;

export const weeklyMTTRMTTD = (incidents = []) => {
    const data = [];
    const weeks = getMarginDateValues(incidents);
    const weeksInterval = getWeeks(weeks[0], weeks[1]);
    weeksInterval.forEach((date) => {
        data.push({
            name: date,
            MTTR: Number.parseFloat(h.formatDurationToH(mttr(incidentsOfTheWeek(incidents, moment(date).week())))),
            MTTD: Number.parseFloat(h.formatDurationToH(mttd(incidentsOfTheWeek(incidents, moment(date).week()))))
        });
    });
    return {data, keys: ['MTTR', 'MTTD']};
};

export const weeklyMTTRbyBrand = (inc = []) => {
    const data = [];
    const weeks = getMarginDateValues(inc);
    const weeksInterval = getWeeks(weeks[0], weeks[1]);
    const incsByBrand = listOfIncByBrands(inc);
    const brands = new Set();
    weeksInterval.forEach((date) => {
        const result = {name: date};
        incsByBrand.map((incident) => {
            const brand = incident[0].Brand;
            brands.add(brand);
            result[brand] = Number.parseFloat(h.formatDurationToH(mttr(incidentsOfTheWeek(incident, moment(date).week()))));
        });
        data.push(result);
    });
    return {data, keys: Array.from(brands)};
};

export const weeklyMTTDbyBrand = (inc = []) => {
    const data = [];
    const weeks = getMarginDateValues(inc);
    const weeksInterval = getWeeks(weeks[0], weeks[1]);
    const incsByBrand = listOfIncByBrands(inc);
    const brands = new Set();
    weeksInterval.forEach((date) => {
        const result = {name: date};
        incsByBrand.map((incident) => {
            const brand = incident[0].Brand;
            brands.add(brand);
            result[brand] = Number.parseFloat(h.formatDurationToH(mttd(incidentsOfTheWeek(incident, moment(date).week()))));
        });
        data.push(result);
    });
    return {data, keys: Array.from(brands)};
};

export const getWeeks = (start = '', end = '') => {
    const weeks = [];
    const current = moment(start).startOf('week');
    while (current.isSameOrBefore(end)) {
        weeks.push(current.format(DATE_FORMAT));
        current.add(7, 'days');
    }
    return weeks;
};

export const sortInAscOrderAndGetTop5 = (incidents, fieldToSort) => incidents
    .sort((a, b) => Number(a[fieldToSort]) - Number(b[fieldToSort]))
    .slice(0, 5);

export const sortInDescOrderAndGetTop5 = (incidents, fieldToSort) => incidents
    .sort((a, b) => Number(b[fieldToSort]) - Number(a[fieldToSort]))
    .slice(0, 5);

const filterByImpactedBrand = (incidents, brandName) => incidents
    .filter((incident) => incident.impactedBrand === brandName);

const sumBrandLossPerInterval = (data = [], brandName, propertyToSum) => {
    const filteredByImpactedBrand = filterByImpactedBrand(data, brandName);

    return sumPropertyInArrayOfObjects(filteredByImpactedBrand, propertyToSum);
};

const filterIncidentsPerInterval = (data = [], brandName, propertyToSum) => {
    const propertyToSort = 'lostRevenue';
    const propertyToGetUniqueValues = 'incidentNumber';
    const filteredByImpactedBrand = filterByImpactedBrand(data, brandName);
    const uniqueIncidentNumbers = getListOfUniqueProperties(filteredByImpactedBrand, propertyToGetUniqueValues);

    const tooltipEntryData = uniqueIncidentNumbers.reduce((prev, incidentNumber) => {
        const incidentNumberLink = buildTicketLink(incidentNumber);
        const incidentsFilteredByUniqueNumber = filteredByImpactedBrand
            .filter((item) => item.incidentNumber === incidentNumber);
        const lostRevenue = sumPropertyInArrayOfObjects(incidentsFilteredByUniqueNumber, propertyToSum);

        const tooltipEntry = {
            incidentNumberLink: renderToString(incidentNumberLink),
            lostRevenue
        };

        return [
            ...prev,
            tooltipEntry
        ];
    }, []);

    return sortInDescOrderAndGetTop5(tooltipEntryData, propertyToSort);
};

const buildRawSeriesForFinancialImpact = (brandNames, weekIntervals, incidentsPerIntervalMap, propertyToSum) => {
    return weekIntervals.map((w) => {
        const interval = {name: w};
        brandNames.forEach((brandName) => {
            interval[brandName] = sumBrandLossPerInterval(incidentsPerIntervalMap[w], brandName, propertyToSum);
        });
        return interval;
    });
};

const buildFinancialImpactTooltipData = (brandNames, weekIntervals, incidentsPerIntervalMap, propertyToSum) => weekIntervals
    .reduce((prev, weekInterval) => {
        const newMetricPoint = brandNames.reduce((map, brand) => ({
            ...map,
            [brand]: filterIncidentsPerInterval(incidentsPerIntervalMap[weekInterval], brand, propertyToSum)
        }), {});

        return {
            ...prev,
            [weekInterval]: newMetricPoint
        };
    }, {});

const buildIncidentsPerIntervalHash = (weekIntervals, incidents) => weekIntervals
    .reduce((prev, weekInterval) => {
        const week = moment(weekInterval).week();
        return {
            ...prev,
            [weekInterval]: incidentsOfTheWeek(incidents, week)
        };
    }, {});

export const buildFinancialImpactData = (incidents, propertyToSum) => {
    const [lowerMarginDateValue, maxMarginDateValue] = getMarginDateValues(incidents);
    const weekIntervals = getWeeks(lowerMarginDateValue, maxMarginDateValue);
    const brands = getListOfUniqueProperties(incidents, 'impactedBrand');
    const incidentsPerIntervalHash = buildIncidentsPerIntervalHash(weekIntervals, incidents);
    const tooltipData = buildFinancialImpactTooltipData(brands, weekIntervals, incidentsPerIntervalHash, propertyToSum);
    return {
        data: buildRawSeriesForFinancialImpact(brands, weekIntervals, incidentsPerIntervalHash, propertyToSum),
        brands,
        tooltipData
    };
};

export const getWeeklyCounts = (startDate, endDate, tickets, key) => {
    const weeks = getWeeks(startDate, endDate);
    const data = weeks.map((w) => ({name: w, count: 0}));
    tickets.forEach((ticket) => {
        const date = moment(ticket[key]).startOf('week').format(DATE_FORMAT);
        const idx = data.findIndex(({name}) => name === date);
        if (idx > 0) {
            data[idx].count++;
        }
    });
    return {data, keys: ['count']};
};
