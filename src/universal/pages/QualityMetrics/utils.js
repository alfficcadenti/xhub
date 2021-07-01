import React from 'react';
import moment from 'moment';
import qs from 'query-string';
import {checkResponse} from '../../pages/utils';
import {HCOM_PORTFOLIOS, VRBO_PORTFOLIOS, PRIORITY_LABELS, P1_LABEL, P2_LABEL, P3_LABEL, P4_LABEL, P5_LABEL, NOT_PRIORITIZED_LABEL} from './constants';
import {HOTELS_COM_BRAND, DATE_FORMAT} from '../../constants';
import {formatDuration} from '../../components/utils';


export const getBrandPortfolios = (brand) => (
    brand === HOTELS_COM_BRAND ? HCOM_PORTFOLIOS : VRBO_PORTFOLIOS
);

export const getPortfoliosQuery = (brandPortfolios) => (
    brandPortfolios.length
        ? `&portfolios=${brandPortfolios.map((p) => p.value).join('&portfolios=')}`
        : ''
);

export const filterBrandPortfolios = (portfolios, brand) => {
    const brandPortfolioValues = getBrandPortfolios(brand).map(({value}) => value);
    return (portfolios || []).filter(({value}) => brandPortfolioValues.includes(value));
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


export const getQueryValues = (search, selectedBrands) => {
    const {portfolios, from, to} = qs.parse(search);
    const isValidDateRange = validDateRange(from, to);
    const brandPortfolios = getBrandPortfolios(selectedBrands[0]);
    const initialPortfolios = (Array.isArray(portfolios) ? portfolios : [portfolios])
        .map((portfolio) => brandPortfolios.find((p) => p.value === portfolio))
        .filter((portfolio) => !!portfolio);
    return {
        initialStart: isValidDateRange ? moment(from) : moment().subtract(6, 'months'),
        initialEnd: isValidDateRange ? moment(to) : moment(),
        initialPortfolios
    };
};

export const getQueryString = (brand, portfolios, start, end) => {
    const brandQuery = `selectedBrand=${brand}`;
    const brandPortfolios = filterBrandPortfolios(portfolios, brand);
    const portfoliosQuery = brandPortfolios.length
        ? `&portfolios=${brandPortfolios.map((p) => p.value).join('&portfolios=')}`
        : '';
    const dateQuery = `&from=${start.toISOString()}&to=${end.toISOString()}`;
    return `/quality-metrics?${brandQuery}${dateQuery}${portfoliosQuery}`;
};

export const getPropValue = (item, prop) => item[prop] || item[prop] === 0 ? item[prop] : '-';

export const formatDefect = (defect) => ({
    Portfolio: getPropValue(defect, 'portfolio'),
    Key: defect.defectNumber
        ? (<a href={`${defect.url}`} target="_blank">{defect.defectNumber}</a>)
        : '-',
    id: getPropValue(defect, 'defectNumber'),
    Summary: getPropValue(defect, 'summary'),
    Priority: defect.priority || NOT_PRIORITIZED_LABEL,
    Status: getPropValue(defect, 'status'),
    Resolution: getPropValue(defect, 'resolution'),
    Opened: getPropValue(defect, 'openDate'),
    'Days to Resolve': getPropValue(defect, 'daysToResolve'),
    'Time to Resolve': defect.timeToResolve || defect.timeToResolve === 0
        ? formatDuration(defect.timeToResolve, 'minutes')
        : '-'
});

export const findAndFormatTicket = (tickets, id) => {
    const entries = Object.entries(tickets.portfolioTickets || {});
    for (let i = 0; i < entries.length; i++) {
        const [portfolio, portfolioTickets] = entries[i];
        const ticketDetails = Object.values(portfolioTickets);
        for (let j = 0; j < ticketDetails.length; j++) {
            if (ticketDetails[j].defectNumber === id) {
                const ticket = ticketDetails[j];
                ticket.portfolio = portfolio;
                return formatDefect(ticket);
            }
        }
    }
    return null;
};

export const mapPriority = (p) => {
    if (!p) {
        return NOT_PRIORITIZED_LABEL;
    }
    if (p.includes(0)) {
        return P1_LABEL;
    }
    for (let i = 0; i < PRIORITY_LABELS.length; i++) {
        if (p.includes(i + 1)) {
            return PRIORITY_LABELS[i];
        }
    }
    return NOT_PRIORITIZED_LABEL;
};

export const formatBarChartData = (data) => {
    return Object.entries(data)
        .map(([date, {p1 = 0, p2 = 0, p3 = 0, p4 = 0, p5 = 0, totalTickets = 0, ticketIds = []}]) => {
            return {
                date,
                [P1_LABEL]: p1,
                [P2_LABEL]: p2,
                [P3_LABEL]: p3,
                [P4_LABEL]: p4,
                [P5_LABEL]: p5,
                counts: totalTickets,
                tickets: ticketIds};
        }, []);
};

export const formatTTRData = (data) => {
    return Object.entries(data || {})
        .map(([date, {p1DaysToResolve = 0, p2DaysToResolve = 0, p3DaysToResolve = 0, p4DaysToResolve = 0, p5DaysToResolve = 0, totalTickets = 0, ticketIds = []}]) => {
            return {
                date,
                [P1_LABEL]: p1DaysToResolve,
                [P2_LABEL]: p2DaysToResolve,
                [P3_LABEL]: p3DaysToResolve,
                [P4_LABEL]: p4DaysToResolve,
                [P5_LABEL]: p5DaysToResolve,
                counts: totalTickets,
                tickets: ticketIds
            };
        });
};

export const formatPriorityCountsData = (data) => {
    return Object.entries(data || {})
        .map(([date, {p1 = 0, p2 = 0, p3 = 0, p4 = 0, p5 = 0, totalTickets = 0, ticketIds = []}]) => {
            return {
                date,
                [P1_LABEL]: p1,
                [P2_LABEL]: p2,
                [P3_LABEL]: p3,
                [P4_LABEL]: p4,
                [P5_LABEL]: p5,
                counts: totalTickets,
                tickets: ticketIds
            };
        });
};

export const formatPriorityLineChartData = (data, dataKey) => ((dataKey === 'timetoresolve')
    ? formatTTRData(data)
    : formatPriorityCountsData(data));

export const formatDurationData = (data) => {
    return Object.entries(data).reduce((acc, [Portfolio, {
        avgP1MinsToResolve = 0,
        avgP2MinsToResolve = 0,
        avgP3MinsToResolve = 0,
        avgP4MinsToResolve = 0,
        avgP5MinsToResolve = 0,
        totalCount = 0,
        projectTTRSummaries = {}
    }]) => {
        acc[Portfolio] = {
            p1: avgP1MinsToResolve,
            p2: avgP2MinsToResolve,
            p3: avgP3MinsToResolve,
            p4: avgP4MinsToResolve,
            p5: avgP5MinsToResolve,
            totalTickets: totalCount,
            ticketIds: Object.values(projectTTRSummaries).reduce((all, {ticketIds}) => [...all, ...ticketIds], [])
        };
        return acc;
    }, {});
};

export const formatWoWData = (data) => {
    return Object.entries(data)
        .map(([date, {numberOfCreatedIssues = 0, numberOfResolvedIssues = 0, diffResolvedCreated = 0, ticketIds = [], resolvedTicketIds = []}]) => {
            return {
                date,
                created: numberOfCreatedIssues,
                resolved: numberOfResolvedIssues,
                diff: diffResolvedCreated,
                'created tickets': ticketIds,
                'resolved tickets': resolvedTicketIds,
                'all tickets': [...ticketIds, ...resolvedTicketIds]
            };
        }, []);
};

const TOTAL_UNIQUE_ISSUES_LABEL = 'Total Unique Issues';

export const groupDataByPillar = (data = {}, portfolios = [], brand) => {
    const keys = ['p1', 'p2', 'p3', 'p4', 'p5', 'notPrioritized', 'totalTickets'];
    const result = portfolios.reduce((acc, {text}) => {
        acc[text] = {};
        return acc;
    }, {});
    // eslint-disable-next-line complexity
    return Object.entries(data).reduce((acc, [, counts]) => {
        if (counts.ticketIds) {
            const project = counts.ticketIds[0].split('-')[0];
            const portfolio = getBrandPortfolios(brand).find((p) => p.projects.includes(project));
            if (portfolio && acc[portfolio.text]) {
                const portfolioKey = portfolio.text;
                keys.forEach((key) => {
                    if (acc[portfolioKey][key] && counts[key]) {
                        acc[portfolioKey][key] += counts[key];
                    } else if (counts[key]) {
                        acc[portfolioKey][key] = counts[key];
                    }
                });
                if (acc[portfolioKey].ticketIds && counts.ticketIds) {
                    acc[portfolioKey].ticketIds = acc[portfolioKey].ticketIds.concat(counts.ticketIds);
                } else if (counts.ticketIds) {
                    acc[portfolioKey].ticketIds = counts.ticketIds;
                }
            }
        }
        return acc;
    }, result);
};

export const formatTableData = (rawData, onClickHandler, rowKey = 'Project', isDuration = false) => {
    const data = [];
    const totalCounts = {
        [rowKey]: TOTAL_UNIQUE_ISSUES_LABEL,
        p1: 0,
        p2: 0,
        p3: 0,
        p4: 0,
        p5: 0,
        notPrioritized: 0,
        totalTickets: 0
    };
    Object.entries(rawData || {})
        .forEach(([key, counts]) => {
            const row = {
                [rowKey]: key,
                p1: '-',
                p2: '-',
                p3: '-',
                p4: '-',
                p5: '-',
                notPrioritized: '-',
                totalTickets: 0
            };
            Object.entries(counts)
                .forEach(([priority, count]) => {
                    row[priority] = count;
                    totalCounts[priority] = parseInt(totalCounts[priority], 10) + count;
                });
            data.push(row);
        });
    if (!isDuration) {
        data.push(totalCounts);
    }
    const formatLink = (value, key, priority) => {
        if (value === '-') {
            return '-';
        }
        const text = (isDuration && priority)
            ? formatDuration(value, 'minutes')
            : value;
        const clickHandler = () => onClickHandler(rawData, key, priority);
        return (
            <div
                className="count-link"
                role="button"
                tabIndex={0}
                onClick={clickHandler}
                onKeyUp={clickHandler}
            >
                {text}
            </div>
        );
    };
    const result = data.map((row) => {
        const {p1, p2, p3, p4, p5, notPrioritized, totalTickets} = row;
        const key = row[rowKey];
        return {
            [rowKey]: key,
            p1: formatLink(p1, key, P1_LABEL),
            p2: formatLink(p2, key, P2_LABEL),
            p3: formatLink(p3, key, P3_LABEL),
            p4: formatLink(p4, key, P4_LABEL),
            p5: formatLink(p5, key, P5_LABEL),
            notPrioritized: formatLink(notPrioritized, key, 'Not prioritized'),
            totalTickets: formatLink(totalTickets, key, null)
        };
    });
    return result;
};

export const processTwoDimensionalIssues = (
    allJiraTickets, projectTickets, project, portfolios, priority
) => {
    const selectedPriority = mapPriority(priority);
    const tickets = project === TOTAL_UNIQUE_ISSUES_LABEL
        ? Object.values(projectTickets).reduce((acc, curr) => acc.concat(curr.ticketIds), [])
        : projectTickets[project].ticketIds;
    const finalList = [];
    portfolios.forEach((portfolio) => {
        tickets.forEach((id) => {
            const t = allJiraTickets.portfolioTickets?.[portfolio.value]?.[id];
            if (t && (!priority || mapPriority(t.priority) === selectedPriority)) {
                t.portfolio = portfolio.text;
                finalList.push(t);
            }
        });
    });
    return {
        data: (finalList || []).map(formatDefect),
        description: priority
            ? `Displaying "${project}" defects with ${priority} priority`
            : `Displaying all ${project ? `"${project}"` : ''} defects`
    };
};

export const formatCreatedVsResolvedData = (data, priorities = []) => {
    const {createdIssuesByWeek, resolvedIssuesByWeek} = data;
    const priorityKeys = priorities.map((p) => p.toLowerCase());
    // handle notPrioritized priority
    const notPrioritizedIdx = priorityKeys.findIndex((pk) => pk === 'notprioritized');
    if (notPrioritizedIdx !== -1) {
        priorityKeys[notPrioritizedIdx] = 'notPrioritized';
    }
    return Object
        .values(createdIssuesByWeek || {})
        .map((createdWeek) => {
            const resolvedWeek = resolvedIssuesByWeek[createdWeek.weekStartDate] || {};
            const result = {
                date: createdWeek.weekStartDate,
                'Total Created': priorityKeys.reduce((acc, curr) => acc + (createdWeek[curr] || 0), 0),
                'Total Resolved': priorityKeys.reduce((acc, curr) => acc + (resolvedWeek[curr] || 0), 0),
                createdTickets: createdWeek.ticketIds,
                resolvedTickets: resolvedWeek.ticketIds
            };
            return result;
        });
};

export const getPanelDataUrl = (start, end, portfolios, brand, panel) => {
    const baseUrl = '/v1/portfolio';
    const dateQuery = `fromDate=${start.format(DATE_FORMAT)}&toDate=${end.format(DATE_FORMAT)}`;
    const portfoliosQuery = `portfolios=${filterBrandPortfolios(portfolios, brand).map(({value}) => value).join('&portfolios=')}`;
    const query = portfolios && portfolios.length
        ? `?${dateQuery}&${portfoliosQuery}`
        : `?${dateQuery}`;
    if (!panel) {
        return `${baseUrl}${query}`;
    } else if (panel === 'ttrSummary') {
        return `${baseUrl}/ttrSummary${query}`;
    }
    return `${baseUrl}/panel/${panel}${query}`;
};

export const fetchPanelData = async (start, end, brandPortfolios, brand, panel) => (
    fetch(getPanelDataUrl(start, end, brandPortfolios, brand, panel))
        .then(checkResponse)
        .then((response) => ({
            data: response?.data || response || {},
            queries: response.queries || [],
            isLoading: false,
            error: ''
        }))
        .catch(() => ({
            data: {},
            isLoading: false,
            error: 'Failed to retrieve panel data. Try refreshing the page.'
        }))
);
