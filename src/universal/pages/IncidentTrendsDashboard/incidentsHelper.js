/* eslint-disable complexity */
/* eslint-disable  no-use-before-define */
/* eslint-disable no-shadow */

import moment from 'moment';
import * as h from '../../components/utils/formatDate';
import {DATE_FORMAT} from './constants';
import {isArray} from 'util';

const getAllIncidents = (data = []) => {
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

const getIncidentsData = (filteredIncidents = []) => {
    const incidentNewFormat = filteredIncidents.map((inc) => {
        return {
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
        };
    });
    return incidentNewFormat;
};

const incLink = (incNumber) => (`<a key='${incNumber}link' href='https://expedia.service-now.com/go.do?id=${incNumber}' target='_blank'>${incNumber}</a>`);

const distinct = (value, index, self) => self.indexOf(value) === index;

const listOfBrands = (inc = []) => inc
    .map((x) => x.Brand || x.brand)
    .filter(distinct);

const max = (accumulator, currentValue) => (currentValue > accumulator ? currentValue : accumulator);
const min = (accumulator, currentValue) => (currentValue < accumulator ? currentValue : accumulator);

export const getMarginDateValues = (inc = []) => {
    const dates = inc.map((x) => moment(x.startedAt));

    return dates.length === 0 || !isArray(dates) ?
        [] :
        [
            moment(dates.reduce(min)).format(DATE_FORMAT),
            moment(dates.reduce(max)).format(DATE_FORMAT)
        ];
};

const weeksInterval = (inc = []) => (
    inc.length === 0 || !isArray(inc) ?
        [] :
        [
            Math.min(...inc.map((x) => moment(x.startedAt).week())),
            Math.max(...inc.map((x) => moment(x.startedAt).week()))
        ]
);

const brandIncidents = (inc, brand) => inc.filter((x) => x.Brand === brand);

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
        const P1inc = brandIncidentsList.filter((x) => x.priority === '1-Critical').length;
        const P2inc = brandIncidentsList.filter((x) => x.priority === '2-High').length;
        const total = brandIncidentsList.length;
        const brandTotalDuration = h.formatDurationToHours(totalDuration(brandIncidentsList));

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

const totalDurationByBrand = (inc = []) => listOfIncByBrands(inc)
    .map((x) => ({
        'Brand': x[0].Brand,
        'totalDuration': totalDuration(x)
    }));

const totalDuration = (inc = []) =>
    inc.reduce((acc, curr) => (acc + Number(curr.duration)), 0);

const totalTTR = (inc = []) =>
    inc.reduce((acc, curr) => (acc + Number(curr.ttr)), 0);

const totalTTD = (inc = []) =>
    inc.reduce((acc, curr) => (acc + Number(curr.ttd)), 0);

const mttr = (inc = []) => (totalTTR(inc) / inc.length) || 0;
const mttd = (inc = []) => (totalTTD(inc) / inc.length) || 0;

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

    return incsByBrand.map((x) => {
        const brandName = x[0].Brand;
        const weeklyMTTR = [];

        weeksInterval.forEach((date) => {
            weeklyMTTR.push(h.formatDurationToH(mttr(incidentsOfTheWeek(x, moment(date).week()))));
        });

        return {serie: brandName, data: weeklyMTTR};
    });
};

const weeklyMTTDbyBrand = (inc = []) => {
    const weeks = getMarginDateValues(inc);
    const weeksInterval = weeklyRange(weeks[0], weeks[1]);
    const incsByBrand = listOfIncByBrands(inc);

    return incsByBrand.map((x) => {
        const brandName = x[0].Brand;
        const weeklyMTTD = [];

        weeksInterval.forEach((date) => {
            weeklyMTTD.push(h.formatDurationToH(mttr(incidentsOfTheWeek(x, moment(date).week()))));
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

const top5LongestDuration = (inc) => (inc.sort((a, b) => (Number(b.duration) - Number(a.duration))).slice(0, 5));
const top5ShortestDuration = (inc) => (inc.sort((a, b) => (Number(a.duration) - Number(b.duration))).slice(0, 5));

const formatSeriesForChart = (data = []) => data
    .map((item) => ({
        ...item,
        type: 'line'
    }));

const extractIncidentsNumbers = (data) => data && data
    .map((item) => item.incidentNumber)
    .filter(distinct);

const sumBrandLossPerInterval = (data = [], brandName) => {
    const filteredByBrand = data.filter((item) => item.brand === brandName);

    return filteredByBrand.reduce((acc, curr) => (acc + Number(curr.estimatedLostRevenue)), 0) || 0;
};

const sortInDescOrderAndGetFirstFive = (data) => data
    .sort((a, b) => b.lostRevenue - a.lostRevenue)
    .slice(0, 5);

const filterIncidentsPerInterval = (data = [], brandName) => {
    const filteredByBrand = data.filter((item) => item.brand === brandName);
    const uniqueIncidentNumbers = extractIncidentsNumbers(filteredByBrand);

    const tooltipEntryData = uniqueIncidentNumbers.reduce((prev, incidentNumber) => {
        const incidentNumberLink = incLink(incidentNumber);
        const lostRevenue = filteredByBrand
            .filter((item) => item.incidentNumber === incidentNumber)
            .reduce((acc, curr) => {
                return acc + Number(curr.estimatedLostRevenue);
            }, 0).toFixed();

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

const prepareRawSeriesForLostRevenue = (brandNames, weekIntervals, incidentsPerIntervalMap) => {
    return brandNames && brandNames.reduce((prev, brandName) => {
        const data = weekIntervals.map((weekInterval) => {
            return sumBrandLossPerInterval(incidentsPerIntervalMap[weekInterval], brandName);
        });

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

const prepareTooltipDataForLostRevenue = (brandNames, weekIntervals, incidentsPerIntervalMap) => {
    return weekIntervals.reduce((prev, weekInterval) => {
        const newMetricPoint = brandNames.reduce((map, brand) => ({
            ...map,
            [brand]: filterIncidentsPerInterval(incidentsPerIntervalMap[weekInterval], brand)
        }), {});

        return {
            ...prev,
            [weekInterval]: newMetricPoint
        };
    }, {});
};

const buildIncidentsPerIntervalMap = (weekIntervals, filteredLostRevenues) => {
    return weekIntervals.reduce((prev, weekInterval) => {
        const week = moment(weekInterval).week();
        const incidentsPerInterval = incidentsOfTheWeek(filteredLostRevenues, week);

        return {
            ...prev,
            [weekInterval]: incidentsPerInterval
        };
    }, {});
};

export const prepareBrandLossData = (filteredLostRevenues) => {
    const [lowerMarginDateValue, maxMarginDateValue] = getMarginDateValues(filteredLostRevenues);
    const weekIntervals = weeklyRange(lowerMarginDateValue, maxMarginDateValue);
    const brandNames = listOfBrands(filteredLostRevenues);
    const incidentsPerIntervalMap = buildIncidentsPerIntervalMap(weekIntervals, filteredLostRevenues);
    const rawSeries = prepareRawSeriesForLostRevenue(brandNames, weekIntervals, incidentsPerIntervalMap);
    const series = formatSeriesForChart(rawSeries);
    const tooltipData = prepareTooltipDataForLostRevenue(brandNames, weekIntervals, incidentsPerIntervalMap);

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
    getAllIncidents,
    getIncidentsData,
    getIncMetricsByBrand,
    totalDurationByBrand,
    listOfBrands,
    listOfIncByBrands,
    totalDuration,
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
    weeklyRange,
    top5LongestDuration,
    top5ShortestDuration
};
