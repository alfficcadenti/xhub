import React from 'react';
import moment from 'moment';
import qs from 'query-string';
import {checkResponse} from '../../pages/utils';
import {
    PRIORITY_LABELS,
    P1_LABEL, P2_LABEL, P3_LABEL, P4_LABEL, P5_LABEL, NOT_PRIORITIZED_LABEL,
    HCOM_PROJECT_KEYS, VRBO_PROJECT_KEYS, PROJECT_PORTFOLIO_MAP, HCOM_PORTFOLIOS, VRBO_PORTFOLIOS
} from './constants';
import {HOTELS_COM_BRAND, DATE_FORMAT} from '../../constants';
import {formatDuration} from '../../components/utils';

export const getBrandPortfolios = (brand) => (
    brand === HOTELS_COM_BRAND ? HCOM_PORTFOLIOS : VRBO_PORTFOLIOS
);

export const getBrandProjectKeys = (brand) => (
    brand === HOTELS_COM_BRAND ? HCOM_PROJECT_KEYS : VRBO_PROJECT_KEYS
);

export const getPortfoliosQuery = (brandPortfolios) => (
    brandPortfolios.length
        ? `&portfolios=${brandPortfolios.map((p) => p.value).join('&portfolios=')}`
        : ''
);

export const getProjectKeysQuery = (brandProjectKeys) => (
    brandProjectKeys.length
        ? `&projectKeys=${brandProjectKeys.map((p) => p.value).join('&projectKeys=')}`
        : ''
);

export const filterBrandProjectKeys = (projectKeys, brand) => {
    const brandProjectKeyValues = getBrandProjectKeys(brand);
    return (projectKeys || []).filter((projectKey) => brandProjectKeyValues.includes(projectKey));
};

export const validDateRange = (start, end) => {
    const startMoment = moment(start);
    return !!start && !!end && startMoment.isBefore(new Date()) && startMoment.isBefore(end);
};

export const getQueryValues = (search, selectedBrands) => {
    const {projectKeys, from, to} = qs.parse(search);
    const isValidDateRange = validDateRange(from, to);
    const brandProjectKeys = getBrandProjectKeys(selectedBrands[0]);
    const initialProjectKeys = (Array.isArray(projectKeys) ? projectKeys : [projectKeys])
        .filter((projectKey) => brandProjectKeys.includes(projectKey));
    return {
        initialStart: isValidDateRange ? moment(from) : moment().subtract(6, 'months'),
        initialEnd: isValidDateRange ? moment(to) : moment(),
        initialProjectKeys
    };
};

export const getQueryString = (brand, projectKeys, start, end) => {
    const brandQuery = `selectedBrand=${brand}`;
    const brandProjectKeys = filterBrandProjectKeys(projectKeys, brand);
    const projectKeysQuery = brandProjectKeys.length
        ? `&projectKeys=${brandProjectKeys.join('&projectKeys=')}`
        : '';
    const dateQuery = `&from=${start.toISOString()}&to=${end.toISOString()}`;
    return `/quality-metrics?${brandQuery}${dateQuery}${projectKeysQuery}`;
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
        .map(([date, {p1 = 1, p2 = 1, p3 = 1, p4 = 1, p5 = 1,
            p1DaysToResolve = 0, p2DaysToResolve = 0, p3DaysToResolve = 0, p4DaysToResolve = 0, p5DaysToResolve = 0, totalTickets = 0, ticketIds = []}]) => {
            return {
                date,
                [P1_LABEL]: Math.round(p1DaysToResolve / p1),
                [P2_LABEL]: Math.round(p2DaysToResolve / p2),
                [P3_LABEL]: Math.round(p3DaysToResolve / p3),
                [P4_LABEL]: Math.round(p4DaysToResolve / p4),
                [P5_LABEL]: Math.round(p5DaysToResolve / p5),
                counts: totalTickets,
                tickets: ticketIds
            };
        });
};

export const formatPriorityCountsData = (data) => {
    return Object.entries(data || {})
        .map(([date, {p1 = 0, p2 = 0, p3 = 0, p4 = 0, p5 = 0, totalTickets = 0, notPrioritized = 0, ticketIds = []}]) => {
            return {
                date,
                [P1_LABEL]: p1,
                [P2_LABEL]: p2,
                [P3_LABEL]: p3,
                [P4_LABEL]: p4,
                [P5_LABEL]: p5,
                [NOT_PRIORITIZED_LABEL]: notPrioritized,
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

export const groupDataByPillar = (data = {}) => {
    const columns = ['p1', 'p2', 'p3', 'p4', 'p5', 'notPrioritized', 'totalTickets'];
    // eslint-disable-next-line complexity
    return Object.entries(data).reduce((acc, [projectKey, counts]) => {
        if (counts.ticketIds) {
            const portfolioKey = PROJECT_PORTFOLIO_MAP[projectKey]?.text;
            if (portfolioKey) {
                if (!acc[portfolioKey]) {
                    acc[portfolioKey] = {};
                }
                columns.forEach((col) => {
                    if (acc[portfolioKey][col] && counts[col]) {
                        acc[portfolioKey][col] += counts[col];
                    } else if (counts[col]) {
                        acc[portfolioKey][col] = counts[col];
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
    }, {});
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

export const processTwoDimensionalIssues = (allJiraTickets, projectTickets, project, priority) => {
    const selectedPriority = mapPriority(priority);
    const tickets = project === TOTAL_UNIQUE_ISSUES_LABEL
        ? Object.values(projectTickets).reduce((acc, curr) => acc.concat(curr.ticketIds), [])
        : projectTickets[project].ticketIds;
    const finalList = [];
    tickets.forEach((id) => {
        const projectKey = id?.split('-')[0];
        const portfolio = PROJECT_PORTFOLIO_MAP[projectKey];
        const t = allJiraTickets.portfolioTickets?.[portfolio?.value]?.[id];
        if (t && (!priority || mapPriority(t.priority) === selectedPriority)) {
            t.portfolio = portfolio?.text;
            finalList.push(t);
        }
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

// eslint-disable-next-line complexity
export const getPanelDataUrl = (start, end, projectKeys, brand, panel) => {
    const baseUrl = '/v1/portfolio';
    const dateQuery = `fromDate=${start.format(DATE_FORMAT)}&toDate=${end.format(DATE_FORMAT)}`;
    const projectKeysQuery = projectKeys?.length
        ? `&projectKeys=${filterBrandProjectKeys(projectKeys, brand).join('&projectKeys=')}`
        : '';
    const query = `?${dateQuery}${projectKeysQuery}`;
    if (!panel) {
        return `${baseUrl}${query}`;
    } else if (panel === 'ttrSummary') {
        return `${baseUrl}/ttrSummary${query}`;
    }
    return `${baseUrl}/panel/${panel}${query}`;
};

export const fetchPanelData = async (start, end, brandProjectKeys, brand, panel) => (
    fetch(getPanelDataUrl(start, end, brandProjectKeys, brand, panel))
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
