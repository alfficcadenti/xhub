/* eslint-disable complexity */
/* eslint-disable  no-use-before-define */
/* eslint-disable no-shadow */

import React from 'react';
import {renderToString} from 'react-dom/server';
import moment from 'moment/moment';
import {isArray} from 'util';
import uuid from 'uuid/v1';
import * as h from '../../components/utils/formatDate';
import {DATE_FORMAT} from '../constants';

export const adjustTicketProperties = (tickets = [], type = 'incident') => {
    return tickets.map((t) => {
        const result = {
            ...t,
            'startedAt': t.startedAt ? t.startedAt : t.openDate,
            'Brand': divisionToBrand(t.brand),
            'Division': t.brand,
            'Status': t.status
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
        return (result);
    });
};

export const divisionToBrand = (division = '') => {
    switch (division.toUpperCase()) {
        case 'EGENCIA - CONSOLIDATED':
        case 'EGENCIA':
            return 'Egencia';
        case 'VRBO':
        case 'HOME AWAY':
            return 'Vrbo';
        case 'HOTELS WORLDWIDE (HWW)':
        case 'HCOM':
            return 'Hotels.com';
        default:
            return 'BEX - Expedia Group';
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
    const brandUrl = brand === 'Vrbo' ? url : `https://expedia.service-now.com/go.do?id=${id}`;
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

export const incidentsOfTheWeek = (inc, week = '') => inc.filter((inc) => moment(inc.startedAt).week() === week);

export const getIncMetricsByBrand = (inc = []) => getListOfUniqueProperties(inc, 'Brand')
    .map((brand) => {
        const brandIncidentsList = brandIncidents(inc, brand);
        const brandMTTR = h.formatDurationToHours(mttr(brandIncidentsList));
        const brandMTTD = h.formatDurationToHours(mttd(brandIncidentsList));
        const P1inc = brandIncidentsList.filter((incident) => incident.priority === '1-Critical').length;
        const P2inc = brandIncidentsList.filter((incident) => incident.priority === '2-High').length;
        const total = brandIncidentsList.length;
        const brandTotalDuration = h.formatDurationToHours(sumPropertyInArrayOfObjects(brandIncidentsList, 'duration'));

        return {
            'Brand': brand,
            'P1': P1inc,
            'P2': P2inc,
            'Total': total,
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
    const weeks = getMarginDateValues(incidents);
    const weeksInterval = weeklyRange(weeks[0], weeks[1]);
    const weeklyMTTR = [];
    const weeklyMTTD = [];

    weeksInterval.forEach((date) => {
        weeklyMTTR.push(h.formatDurationToH(mttr(incidentsOfTheWeek(incidents, moment(date).week()))));
        weeklyMTTD.push(h.formatDurationToH(mttd(incidentsOfTheWeek(incidents, moment(date).week()))));
    });

    return [{name: 'MTTR', data: weeklyMTTR}, {name: 'MTTD', data: weeklyMTTD}];
};

export const weeklyMTTRbyBrand = (inc = []) => {
    const weeks = getMarginDateValues(inc);
    const weeksInterval = weeklyRange(weeks[0], weeks[1]);
    const incsByBrand = listOfIncByBrands(inc);

    return incsByBrand.map((incident) => {
        const brandName = incident[0].Brand;
        const weeklyMTTR = [];

        weeksInterval.forEach((date) => {
            weeklyMTTR.push(h.formatDurationToH(mttr(incidentsOfTheWeek(incident, moment(date).week()))));
        });

        return {name: brandName, data: weeklyMTTR};
    });
};

export const weeklyMTTDbyBrand = (inc = []) => {
    const weeks = getMarginDateValues(inc);
    const weeksInterval = weeklyRange(weeks[0], weeks[1]);
    const incsByBrand = listOfIncByBrands(inc);

    return incsByBrand.map((incident) => {
        const brandName = incident[0].Brand;
        const weeklyMTTD = [];

        weeksInterval.forEach((date) => {
            weeklyMTTD.push(h.formatDurationToH(mttd(incidentsOfTheWeek(incident, moment(date).week()))));
        });

        return {name: brandName, data: weeklyMTTD};
    });
};

export const weeklyRange = (start = '', end = '') => {
    if (start >= end) {
        return [start];
    }

    return [
        start,
        ...weeklyRange(
            moment(start)
                .add(7, 'days')
                .format(DATE_FORMAT),
            end
        )
    ];
};

export const sortInAscOrderAndGetTop5 = (incidents, fieldToSort) => incidents
    .sort((a, b) => Number(a[fieldToSort]) - Number(b[fieldToSort]))
    .slice(0, 5);

export const sortInDescOrderAndGetTop5 = (incidents, fieldToSort) => incidents
    .sort((a, b) => Number(b[fieldToSort]) - Number(a[fieldToSort]))
    .slice(0, 5);

export const formatSeriesForChart = (data = []) => data
    .map((item) => ({
        ...item,
        type: 'line'
    }));

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
    return brandNames && brandNames.reduce((prev, brandName) => {
        const data = weekIntervals.map((weekInterval) =>
            sumBrandLossPerInterval(incidentsPerIntervalMap[weekInterval], brandName, propertyToSum));

        const newMetricPoint = {
            name: brandName,
            data
        };

        return [
            ...prev,
            newMetricPoint
        ];
    }, []);
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
        const incidentsPerInterval = incidentsOfTheWeek(incidents, week);

        return {
            ...prev,
            [weekInterval]: incidentsPerInterval
        };
    }, {});

export const buildFinancialImpactData = (incidents, propertyToSum) => {
    const [lowerMarginDateValue, maxMarginDateValue] = getMarginDateValues(incidents);
    const weekIntervals = weeklyRange(lowerMarginDateValue, maxMarginDateValue);
    const impactedBrands = getListOfUniqueProperties(incidents, 'impactedBrand');
    const incidentsPerIntervalHash = buildIncidentsPerIntervalHash(weekIntervals, incidents);
    const rawSeries = buildRawSeriesForFinancialImpact(impactedBrands, weekIntervals, incidentsPerIntervalHash, propertyToSum);
    const series = formatSeriesForChart(rawSeries);
    const tooltipData = buildFinancialImpactTooltipData(impactedBrands, weekIntervals, incidentsPerIntervalHash, propertyToSum);

    return {
        series,
        tooltipData,
        weekIntervals
    };
};

export const getLineData = (startDate, endDate, filteredItems, key) => {
    const sortedItems = filteredItems.sort((a, b) => String(a[key]).localeCompare(String(b[key])));
    const bucketSize = 'days';
    const axisData = [];
    const data = [];
    let bucketTotal = 0;
    const currBucket = moment(startDate);
    const bucketEnd = moment(currBucket).add(1, bucketSize);
    for (let i = 0; i <= sortedItems.length; i++) {
        const item = sortedItems[i];
        if (!item) {
            continue;
        }
        if (moment(item[key]).isBetween(currBucket, bucketEnd, '[)')) {
            bucketTotal++;
        } else {
            while (!moment(item[key]).isBetween(currBucket, bucketEnd, '[)')) {
                data.push(bucketTotal);
                bucketTotal = 0;
                axisData.push(currBucket.format('YYYY-MM-DD'));
                currBucket.add(1, bucketSize);
                bucketEnd.add(1, bucketSize);
            }
            bucketTotal++;
        }
    }
    data.push(bucketTotal);
    axisData.push(currBucket.format('YYYY-MM-DD'));

    return {axisData, data};
};