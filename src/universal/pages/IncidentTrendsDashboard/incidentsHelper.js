/* eslint-disable complexity */
/* eslint-disable  no-use-before-define */
/* eslint-disable no-shadow */

import moment from 'moment';
import * as h from '../../components/utils/formatDate';
import {DATE_FORMAT} from './constants';
import {isArray} from 'util';

export const adjustIncidentProperties = (data = []) => {
    return data.map((inc) => ({
        'incident_summary': inc.incidentSummary,
        'incident_number': inc.incidentNumber,
        'startedAt': inc.startedAt,
        'Root_Cause': inc.rootCause,
        'priority': inc.priority,
        'duration': inc.duration,
        'ttd': inc.ttd,
        'ttr': inc.ttr,
        'Root_Cause_Owner': inc.rootCauseOwner,
        'Brand': inc.brand,
        'Status': inc.status,
        'tag': inc.tag
    }));
};

export const getUniqueIncidents = (rawIncidents) => {
    const uniqueIncidentsHash = rawIncidents.reduce((prev, current) => ({
        ...prev,
        [current.incidentNumber]: current
    }), {});

    return Object.keys(uniqueIncidentsHash).map((item) => uniqueIncidentsHash[item]);
};

export const getIncidentsData = (filteredIncidents = []) => filteredIncidents
    .map((inc) => ({
        Incident: buildIncLink(inc.incident_number) || '',
        Priority: inc.priority || '',
        Brand: inc.Brand || '',
        Started: moment.utc(inc.startedAt).local().format('YYYY-MM-DD HH:mm') || '',
        Summary: inc.incident_summary || '',
        Duration: inc.duration ? h.formatDurationForTable(inc.duration) : '',
        TTD: inc.ttd ? h.formatDurationForTable(inc.ttd) : '',
        TTR: inc.ttr ? h.formatDurationForTable(inc.ttr) : '',
        'Root Cause Owners': inc.Root_Cause_Owner || '',
        Status: inc.Status || '',
        Tag: inc.tag || '',
    }));

const buildIncLink = (incNumber) => (`<a key='${incNumber}link' href='https://expedia.service-now.com/go.do?id=${incNumber}' target='_blank'>${incNumber}</a>`);

const distinct = (value, index, self) => self.indexOf(value) === index;
const removeEmptyStringsFromArray = (item) => item;

const getListOfUniqueProperties = (incidents = [], prop) => incidents
    .map((incident) => incident[prop])
    .filter(distinct)
    .filter(removeEmptyStringsFromArray);

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
        const incidentNumberLink = buildIncLink(incidentNumber);
        const incidentsFilteredByUniqueNumber = filteredByImpactedBrand
            .filter((item) => item.incidentNumber === incidentNumber);
        const lostRevenue = sumPropertyInArrayOfObjects(incidentsFilteredByUniqueNumber, propertyToSum);

        const tooltipEntry = {
            incidentNumberLink,
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
