/* eslint-disable no-unused-vars */
import React, {useState, useEffect} from 'react';
import moment from 'moment';
import DataTable from '../../components/DataTable';
import {isNotEmptyString, isNotDuplicate, checkResponse, sortArrayByMostRecentDate} from '../utils';

const getListOfUniqueProperties = (tickets = [], prop) => tickets
    .map((ticket) => ticket[prop])
    .filter(isNotDuplicate)
    .filter(isNotEmptyString)
    .sort();

const mapLinkedIssues = (i) => {
    const linkedIssues = (i.linkedIssues || []).map((l) => ({
        Ticket: `<a href="https://jira.expedia.biz/browse/${l.id}" target="_blank">${l.id}</a>`,
        Summary: l.summary,
        Status: l.status,
        Assignee: l.assignee || '-'
    }));
    return ({
        Ticket: `<a href="https://jira.expedia.biz/browse/${i.id}" target="_blank">${i.id}</a>`,
        Summary: i.summary,
        'Issue Type': i.issueType,
        Status: i.status,
        Assignee: i.assignee || '-',
        'Linked Issues': !linkedIssues.length
            ? null
            : (
                <>
                    <b>{'Dev Tasks'}</b>
                    <DataTable
                        className="linked-issues__nested-table"
                        data={linkedIssues}
                        columns={['Ticket', 'Summary', 'Status', 'Assignee']}
                    />
                </>
            )
    });
};

// eslint-disable-next-line complexity
const mapTickets = (t) => {
    const linkedIssues = (t.linkedIssues || []).map(mapLinkedIssues);
    return ({
        Ticket: `<a href="https://jira.expedia.biz/browse/${t.id}" target="_blank">${t.id}</a>`,
        Priority: t.priority,
        Opened: !t.createdDate ? '-' : moment(t.createdDate).format('YYYY-MM-DD HH:mm'),
        'Epic Name': t.summary,
        'Owning Org': t.owningOrganization,
        'RC Owner': t.rootCauseOwner,
        'RC Category': t.rootCauseCategory && t.rootCauseCategory.length
            ? t.rootCauseCategory[0]
            : '-',
        Status: t.status,
        linkedIssues, // for filtering purposes
        brandsAffected: t.brandsAffected ? t.brandsAffected.split(',') : [],
        linesOfBusinessImpacted: t.linesOfBusinessImpacted,
        'Linked Issues': !linkedIssues.length
            ? null
            : (
                <>
                    <h3>{'Linked Issues'}</h3>
                    <DataTable
                        className="linked-issues__table"
                        data={linkedIssues}
                        columns={['Ticket', 'Summary', 'Issue Type', 'Status', 'Assignee']}
                        expandableColumns={['Linked Issues']}
                    />
                </>
            )
    });
};

export const useFetchTickets = (
    isApplyClicked,
    startDate,
    endDate,
    applyFilters,
    setIsApplyClicked,
    setCurrentPriorities,
    setCurrentStatuses,
    setCurrentTypes,
    setCurrentOrgs,
    setCurrentRcOwners,
    setCurrentRcCategories
) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [allTickets, setAllTickets] = useState([]);
    const [lastStartDate, setLastStartDate] = useState();
    const [lastEndDate, setLastEndDate] = useState();

    useEffect(() => {
        const fetchTickets = () => {
            setIsLoading(true);
            setLastStartDate(startDate);
            setLastEndDate(endDate);
            // TODO: replace incidents API call with problem management tickets API call
            fetch(`/v1/prbs?fromDate=${startDate}&toDate=${endDate}`)
                .then(checkResponse)
                .then((data) => {
                    const tickets = sortArrayByMostRecentDate(data, 'createdDate');
                    // TODO: temporarily ignore data and replace with mockData
                    setAllTickets(tickets.map(mapTickets));
                    setCurrentOrgs(getListOfUniqueProperties(tickets, 'owningOrganization'));
                    setCurrentRcOwners(getListOfUniqueProperties(tickets, 'rootCauseOwner'));
                    setCurrentPriorities(getListOfUniqueProperties(tickets, 'priority'));
                    setCurrentStatuses(getListOfUniqueProperties(tickets, 'status'));
                    setCurrentRcCategories(getListOfUniqueProperties(tickets, 'rootCauseCategory'));
                    setIsLoading(false);
                })
                .catch((err) => {
                    setIsLoading(false);
                    setError('Could not retrieve all problem management tickets. Refresh the page to try again.');
                    // eslint-disable-next-line no-console
                    console.error(err);
                });
        };

        if (isApplyClicked) {
            if (!moment(startDate).isSame(lastStartDate) || !moment(endDate).isSame(lastEndDate)) {
                fetchTickets();
            } else {
                applyFilters();
            }
        } else {
            fetchTickets(); // trigger fetch on a first page load when no apply is clicked
        }

        return () => {
            setIsApplyClicked(false);
            setCurrentPriorities(['1-Critical', '2-High', '3-Medium', '4-Low']); // TODO hardcoded
            setCurrentStatuses(['To Do', 'In Progress', 'Done', 'Resolved', 'Testing', 'Closed']); // TODO hardcoded
            setCurrentTypes(['Corrective Action', 'Epic', 'Incident', 'Post Mortem', 'Resiliency Validation']); // TODO hardcoded
            setCurrentOrgs(['Egencia', 'Platform & Marketplaces']); // TODO hardcoded
            setCurrentRcOwners(['EWE - Air Development', 'Egencia - Hotel Shopping']); // TODO hardcoded
            setCurrentRcCategories(['Architectural']);
        };
    }, [isApplyClicked]);

    return [
        isLoading,
        error,
        allTickets
    ];
};
