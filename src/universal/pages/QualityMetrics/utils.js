import React from 'react';
import moment from 'moment';
import qs from 'query-string';
import {getBrand} from '../utils';
import {PORTFOLIOS, PRIORITY_LABELS, P1_LABEL, P2_LABEL, P3_LABEL, P4_LABEL, P5_LABEL, NOT_PRIORITIZED_LABEL} from './constants';
import {DATE_FORMAT} from '../../constants';

export const getPortfolioBrand = (selectedBrands) => {
    const selectedBrand = getBrand(selectedBrands[0], 'label');
    return selectedBrand && selectedBrand.portfolioBrand
        ? selectedBrand.portfolioBrand
        : 'HCOM';
};

export const getQueryValues = (search) => {
    const {portfolios} = qs.parse(search);
    const initialPortfolios = (Array.isArray(portfolios) ? portfolios : [portfolios])
        .map((portfolio) => PORTFOLIOS.find((p) => p.value === portfolio))
        .filter((portfolio) => !!portfolio);
    return {initialPortfolios};
};

export const getPropValue = (item, prop) => item[prop] || '-';

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
    'Days to Resolve': getPropValue(defect, 'daysToResolve')
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
    return Object.entries(data)
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
        }, []);
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

export const groupDataByPillar = (data = {}, portfolios = []) => {
    const keys = ['p1', 'p2', 'p3', 'p4', 'p5', 'notPrioritized', 'totalTickets'];
    const result = portfolios.reduce((acc, {text}) => {
        acc[text] = {};
        return acc;
    }, {});
    // eslint-disable-next-line complexity
    return Object.entries(data).reduce((acc, [, counts]) => {
        if (counts.ticketIds) {
            const project = counts.ticketIds[0].split('-')[0];
            const portfolio = PORTFOLIOS.find((p) => p.projects.includes(project));
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

export const formatTableData = (rawData, onClickHandler, rowKey = 'Project') => {
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
    data.push(totalCounts);
    const formatLink = (value, key, priority) => (
        value === '-'
            ? '-'
            : (
                <div
                    className="count-link"
                    role="button"
                    tabIndex={0}
                    onClick={() => onClickHandler(rawData, key, priority)}
                    onKeyUp={() => onClickHandler(rawData, key, priority)}
                >
                    {value}
                </div>
            )
    );
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

const processTableData = (data) => (data || []).map(formatDefect);

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
            const t = allJiraTickets.portfolioTickets[portfolio.value][id];
            if (t && (!priority || mapPriority(t.priority) === selectedPriority)) {
                t.portfolio = portfolio.text;
                finalList.push(t);
            }
        });
    });
    return {
        data: processTableData(finalList),
        description: priority
            ? `Displaying "${project}" defects with ${priority} priority`
            : `Displaying all ${project ? `"${project}"` : ''} defects`
    };
};

export const formatCreatedVsResolvedData = (data) => {
    const {createdIssuesByWeek, resolvedIssuesByWeek} = data;
    const priorityKeys = PRIORITY_LABELS.map((p) => p.toLowerCase());
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
            PRIORITY_LABELS.forEach((priority) => {
                const p = priority.toLowerCase();
                result[`Created ${priority}`] = createdWeek[p] || 0;
                result[`Resolved ${priority}`] = resolvedWeek[p] || 0;
            });
            return result;
        });
};

export const getPanelDataUrl = (portfolios, brand, panel) => {
    const baseUrl = '/v1/portfolio';
    const start = moment().subtract(180, 'days').format(DATE_FORMAT);
    const end = moment().format(DATE_FORMAT);
    const dateQuery = `fromDate=${start}&toDate=${end}`;
    const brandQuery = `brand=${brand}`;
    const portfoliosQuery = `portfolios=${portfolios.map((p) => p.value).join('&portfolios=')}`;
    const query = portfolios && portfolios.length
        ? `?${brandQuery}&${dateQuery}&${portfoliosQuery}`
        : `?${brandQuery}&${dateQuery}`;
    if (!panel) {
        return `${baseUrl}${query}`;
    }
    return `${baseUrl}/panel/${panel}${query}`;
};
