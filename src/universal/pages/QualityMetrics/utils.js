import React from 'react';
import {PRIORITY_LABELS, P1_LABEL, P2_LABEL, P3_LABEL, P4_LABEL} from './constants';

export const getPropValue = (item, prop) => item[prop] || '-';

export const formatDefect = (defect) => ({
    Portfolio: getPropValue(defect, 'portfolio'),
    Key: getPropValue(defect, 'defectNumber'),
    Summary: getPropValue(defect, 'summary'),
    Priority: getPropValue(defect, 'priority'),
    Status: getPropValue(defect, 'status'),
    Resolution: getPropValue(defect, 'resolution'),
    Opened: getPropValue(defect, 'openDate')
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
        return null;
    }
    for (let i = 0; i < PRIORITY_LABELS.length; i++) {
        if (p.includes(PRIORITY_LABELS[i])) {
            return PRIORITY_LABELS[i];
        }
    }
    return null;
};

export const formatBarChartData = (data) => {
    return Object.entries(data)
        .map(([date, {p1 = 0, p2 = 0, p3 = 0, p4 = 0, totalTickets = 0, ticketIds = []}]) => {
            return {
                date,
                [P1_LABEL]: p1,
                [P2_LABEL]: p2,
                [P3_LABEL]: p3,
                [P4_LABEL]: p4,
                counts: totalTickets,
                tickets: ticketIds};
        }, []);
};

const TOTAL_UNIQUE_ISSUES_LABEL = 'Total Unique Issues';

export const formatTableData = (rawData, onClickHandler) => {
    const data = [];
    const totalCounts = {
        Project: TOTAL_UNIQUE_ISSUES_LABEL,
        p1: 0,
        p2: 0,
        p3: 0,
        p4: 0,
        p5: 0,
        notPrioritized: 0,
        totalTickets: 0
    };
    Object.entries(rawData || {})
        .forEach(([project, counts]) => {
            const row = {
                Project: project,
                p1: '-',
                p2: '-',
                p3: '-',
                p4: '-',
                p5: '-',
                notPrioritized: '-'
            };
            Object.entries(counts)
                .forEach(([priority, count]) => {
                    row[priority] = count;
                    totalCounts[priority] = parseInt(totalCounts[priority], 10) + count;
                });
            data.push(row);
        });
    data.push(totalCounts);
    const formatLink = (value, project, priority) => (
        value === '-'
            ? '-'
            : (
                <div
                    className="count-link"
                    role="button"
                    tabIndex={0}
                    onClick={() => onClickHandler(rawData, project, priority)}
                    onKeyUp={() => onClickHandler(rawData, project, priority)}
                >
                    {value}
                </div>
            )
    );
    const result = data.map(({
        Project, p1, p2, p3, p4, p5, notPrioritized, totalTickets
    }) => ({
        Project,
        p1: formatLink(p1, Project, 'P1 - Blocker'),
        p2: formatLink(p2, Project, 'P2 - Major'),
        p3: formatLink(p3, Project, 'P3 - Normal'),
        p4: formatLink(p4, Project, 'P4 - Minor'),
        p5: formatLink(p5, Project, 'P5 - Trivial'),
        notPrioritized: formatLink(notPrioritized, Project, 'Not prioritized'),
        totalTickets: formatLink(totalTickets, Project, null)
    }));
    return result;
};

const processTableData = (data) => (data || []).map(formatDefect);

export const processTwoDimensionalIssues = (
    allJiraTickets, projectTickets, project, portfolios, priority
) => {
    const tickets = project === TOTAL_UNIQUE_ISSUES_LABEL
        ? Object.values(projectTickets).reduce((acc, curr) => acc.concat(curr.ticketIds), [])
        : projectTickets[project].ticketIds;
    const finalList = [];
    portfolios.forEach((portfolio) => {
        tickets.forEach((id) => {
            const t = allJiraTickets.portfolioTickets[portfolio.value][id];
            if (t && (!priority || t.priority === priority)) {
                t.portfolio = portfolio.text;
                finalList.push(t);
            }
        });
    });
    return {
        data: processTableData(finalList)
    };
};

export const getPanelDataUrl = (portfolios, brand, panel) => {
    // const baseUrl = 'https://opxhub-data-service.us-west-2.test.expedia.com/v1/portfolio';
    const baseUrl = '/v1/portfolio';
    const brandQuery = `brand=${brand}`;
    const portfoliosQuery = `portfolios=${portfolios.map((p) => p.value).join('&portfolios=')}`;
    const query = portfolios && portfolios.length
        ? `?${brandQuery}&${portfoliosQuery}`
        : `?${brandQuery}`;
    if (!panel) {
        return `${baseUrl}${query}`;
    }
    return `${baseUrl}/panel/${panel}${query}`;
};
