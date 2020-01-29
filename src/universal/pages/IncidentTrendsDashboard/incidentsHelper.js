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
        'Status': inc.status
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
        Incident: incLink(inc.incident_number) || '',
        Priority: inc.priority || '',
        Brand: inc.Brand || '',
        Started: moment.utc(inc.startedAt).local().format('YYYY-MM-DD HH:mm') || '',
        Summary: inc.incident_summary || '',
        Duration: inc.duration ? h.formatDurationForTable(inc.duration) : '',
        TTD: inc.ttd ? h.formatDurationForTable(inc.ttd) : '',
        TTR: inc.ttr ? h.formatDurationForTable(inc.ttr) : '',
        'Root Cause Owners': inc.Root_Cause_Owner || '',
        Status: inc.Status || ''
    }));

const incLink = (incNumber) => (`<a key='${incNumber}link' href='https://expedia.service-now.com/go.do?id=${incNumber}' target='_blank'>${incNumber}</a>`);

const distinct = (value, index, self) => self.indexOf(value) === index;

const listOfBrands = (incidents = []) => incidents
    .map((incident) => incident.Brand || incident.impactedBrand)
    .filter(distinct);

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

const weeksInterval = (incidents = []) => (
    incidents.length === 0 || !isArray(incidents) ?
        [] :
        [
            Math.min(...incidents.map((incident) => moment(incident.startedAt).week())),
            Math.max(...incidents.map((incident) => moment(incident.startedAt).week()))
        ]
);

const brandIncidents = (incidents, brand) => incidents.filter((incident) => incident.Brand === brand);

const incidentsOfTheWeek = (inc, week = '') => inc.filter((inc) => (moment(inc.startedAt).week() === week));

const incidentsInTimeFrame = (inc, startDate = '', endDate = moment.now) => inc.filter((inc) => (
    moment(inc.startedAt).format(DATE_FORMAT) >= startDate &&
    moment(inc.startedAt).format(DATE_FORMAT) <= endDate)
);

const getIncMetricsByBrand = (inc = []) => listOfBrands(inc)
    .map((brand) => {
        const brandIncidentsList = brandIncidents(inc, brand);
        const brandMTTR = h.formatDurationToHours(mttr(brandIncidentsList));
        const brandMTTD = h.formatDurationToHours(mttd(brandIncidentsList));
        const P1inc = brandIncidentsList.filter((incident) => incident.priority === '1-Critical').length;
        const P2inc = brandIncidentsList.filter((incident) => incident.priority === '2-High').length;
        const total = brandIncidentsList.length;
        const brandTotalDuration = h.formatDurationToHours(sumPropertyInArray(brandIncidentsList, 'duration'));

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

const getMTTRByBrand = (inc = []) => listOfBrands(inc)
    .map((brand) => {
        const brandIncidentsList = brandIncidents(inc, brand);
        const brandMTTR = Number(h.formatDurationToH(mttr(brandIncidentsList)));

        return {
            'Brand': brand,
            'MTTR': brandMTTR,
        };
    });

const listOfIncByBrands = (inc = []) => listOfBrands(inc)
    .map((brand) => brandIncidents(inc, brand));

const totalDurationByBrand = (incidents = []) => listOfIncByBrands(incidents)
    .map((incident) => ({
        'Brand': incident[0].Brand,
        'totalDuration': sumPropertyInArray(incident, 'duration')
    }));

export const sumPropertyInArray = (incidents = [], propertyToSum) =>
    incidents.reduce((acc, curr) => (acc + Number(curr[propertyToSum])), 0);

const mttr = (inc = []) => (sumPropertyInArray(inc, 'ttr') / inc.length) || 0;
const mttd = (inc = []) => (sumPropertyInArray(inc, 'ttd') / inc.length) || 0;

const weeklyMTTRMTTD = (inc = []) => {
    const weeks = getMarginDateValues(inc);
    const weeksInterval = weeklyRange(weeks[0], weeks[1]);
    const weeklyMTTR = [];
    const weeklyMTTD = [];

    weeksInterval.forEach((date) => {
        weeklyMTTR.push(h.formatDurationToH(mttr(incidentsOfTheWeek(inc, moment(date).week()))));
        weeklyMTTD.push(h.formatDurationToH(mttd(incidentsOfTheWeek(inc, moment(date).week()))));
    });

    return [{serie: 'MTTR', data: weeklyMTTR}, {serie: 'MTTD', data: weeklyMTTD}];
};

const weeklyMTTRbyBrand = (inc = []) => {
    const weeks = getMarginDateValues(inc);
    const weeksInterval = weeklyRange(weeks[0], weeks[1]);
    const incsByBrand = listOfIncByBrands(inc);

    return incsByBrand.map((incident) => {
        const brandName = incident[0].Brand;
        const weeklyMTTR = [];

        weeksInterval.forEach((date) => {
            weeklyMTTR.push(h.formatDurationToH(mttr(incidentsOfTheWeek(incident, moment(date).week()))));
        });

        return {serie: brandName, data: weeklyMTTR};
    });
};

const weeklyMTTDbyBrand = (inc = []) => {
    const weeks = getMarginDateValues(inc);
    const weeksInterval = weeklyRange(weeks[0], weeks[1]);
    const incsByBrand = listOfIncByBrands(inc);

    return incsByBrand.map((incident) => {
        const brandName = incident[0].Brand;
        const weeklyMTTD = [];

        weeksInterval.forEach((date) => {
            weeklyMTTD.push(h.formatDurationToH(mttr(incidentsOfTheWeek(incident, moment(date).week()))));
        });

        return {serie: brandName, data: weeklyMTTD};
    });
};

const range = (start, end) => {
    if (start === end) {
        return [start];
    }
    return [start, ...range(start + 1, end)];
};

export const weeklyRange = (start, end) => {
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

export const top5LongestDuration = (inc) => (inc.sort((a, b) => (Number(b.duration) - Number(a.duration))).slice(0, 5));
export const top5ShortestDuration = (inc) => (inc.sort((a, b) => (Number(a.duration) - Number(b.duration))).slice(0, 5));

const formatSeriesForChart = (data = []) => data
    .map((item) => ({
        ...item,
        type: 'line'
    }));

const extractIncidentsNumbers = (data) => data && data
    .map((item) => item.incidentNumber)
    .filter(distinct);

const sumBrandLossPerInterval = (data = [], brandName) => {
    const filteredByBrand = data.filter((item) => item.impactedBrand === brandName);

    return sumPropertyInArray(filteredByBrand, 'estimatedRevenueLoss');
};

const sortInDescOrderAndGetFirstFive = (data) => data
    .sort((a, b) => b.lostRevenue - a.lostRevenue)
    .slice(0, 5);

const filterIncidentsPerInterval = (data = [], brandName) => {
    const filteredByBrand = data.filter((item) => item.impactedBrand === brandName);
    const uniqueIncidentNumbers = extractIncidentsNumbers(filteredByBrand);

    const tooltipEntryData = uniqueIncidentNumbers.reduce((prev, incidentNumber) => {
        const incidentNumberLink = incLink(incidentNumber);
        const incidentsFilteredByUniqueNumber = filteredByBrand
            .filter((item) => item.incidentNumber === incidentNumber);
        const lostRevenue = sumPropertyInArray(incidentsFilteredByUniqueNumber, 'estimatedRevenueLoss').toFixed();

        const tooltipEntry = {
            incidentNumberLink,
            lostRevenue
        };

        return [
            ...prev,
            tooltipEntry
        ];
    }, []);

    return sortInDescOrderAndGetFirstFive(tooltipEntryData);
};

const buildRawSeriesForLostRevenue = (brandNames, weekIntervals, incidentsPerIntervalMap) => {
    return brandNames && brandNames.reduce((prev, brandName) => {
        const data = weekIntervals.map((weekInterval) =>
            sumBrandLossPerInterval(incidentsPerIntervalMap[weekInterval], brandName));

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

const buildTooltipDataForLostRevenue = (brandNames, weekIntervals, incidentsPerIntervalMap) => weekIntervals
    .reduce((prev, weekInterval) => {
        const newMetricPoint = brandNames.reduce((map, brand) => ({
            ...map,
            [brand]: filterIncidentsPerInterval(incidentsPerIntervalMap[weekInterval], brand)
        }), {});

        return {
            ...prev,
            [weekInterval]: newMetricPoint
        };
    }, {});

const buildIncidentsPerIntervalHash = (weekIntervals, filteredLostRevenues) => weekIntervals
    .reduce((prev, weekInterval) => {
        const week = moment(weekInterval).week();
        const incidentsPerInterval = incidentsOfTheWeek(filteredLostRevenues, week);

        return {
            ...prev,
            [weekInterval]: incidentsPerInterval
        };
    }, {});

export const buildBrandLossData = (filteredLostRevenues) => {
    const [lowerMarginDateValue, maxMarginDateValue] = getMarginDateValues(filteredLostRevenues);
    const weekIntervals = weeklyRange(lowerMarginDateValue, maxMarginDateValue);
    const brandNames = listOfBrands(filteredLostRevenues);
    const incidentsPerIntervalHash = buildIncidentsPerIntervalHash(weekIntervals, filteredLostRevenues);
    const rawSeries = buildRawSeriesForLostRevenue(brandNames, weekIntervals, incidentsPerIntervalHash);
    const series = formatSeriesForChart(rawSeries);
    const tooltipData = buildTooltipDataForLostRevenue(brandNames, weekIntervals, incidentsPerIntervalHash);

    return {
        series,
        tooltipData,
        weekIntervals
    };
};

export const lostRevenueTooltipFormatter = (tooltipData, {name, seriesName}) => {
    const incidents = tooltipData[name][seriesName];
    const incidentsString = incidents.map((item) => {
        return `<div class="incident-wrapper">
                        <span class="incident-number">${item.incidentNumberLink}</span>
                        <span class="incident-lost-revenue">${item.lostRevenue}</span>
                        </div>`;
    }).join('');

    return `<div class="lost-revenue-tooltip">${incidentsString}</div>`;
};

export default {
    getIncMetricsByBrand,
    totalDurationByBrand,
    listOfBrands,
    listOfIncByBrands,
    mttr,
    brandIncidents,
    incidentsInTimeFrame,
    getMTTRByBrand,
    getMarginDateValues,
    weeksInterval,
    incidentsOfTheWeek,
    weeklyMTTRMTTD,
    weeklyMTTRbyBrand,
    weeklyMTTDbyBrand,
    range,
    weeklyRange
};
