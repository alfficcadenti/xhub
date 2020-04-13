import React, {useState, useEffect, useRef} from 'react';
import moment from 'moment';
import {data} from './data';
import DataTable from '../../components/DataTable';

const mapLinkedIssues = (i) => {
    const linkedIssues = (i.linkedIssues || []).map((l) => ({
        Ticket: `<a href="https://jira.expedia.biz/browse/${l.ticketNumber}" target="_blank">${l.ticketNumber}</a>`,
        Summary: l.summary,
        Status: l.status,
        Assignee: l.assignee
    }));
    return ({
        Ticket: `<a href="https://jira.expedia.biz/browse/${i.ticketNumber}" target="_blank">${i.ticketNumber}</a>`,
        Summary: i.summary,
        'Issue Type': i.issueType,
        Status: i.status,
        Assignee: i.assignee,
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
        Ticket: `<a href="https://jira.expedia.biz/browse/${t.ticketNumber}" target="_blank">${t.ticketNumber}</a>`,
        Priority: t.priority,
        Brand: t.brand,
        Opened: !t.openDate ? '-' : moment(t.openDate).format('YYYY-MM-DD hh:mm'),
        Summary: t.summary,
        'Owning Org': t.owningOrganization,
        'RC Owner': t.rootCauseOwner,
        'RC Category': t.rootCauseCategory && t.rootCauseCategory.length
            ? t.rootCauseCategory[0]
            : '-',
        Status: t.status,
        linkedIssues, // for filtering purposes
        brandsAffected: t.brandsAffected,
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

export const useIsMount = () => {
    const isMountRef = useRef(true);

    useEffect(() => {
        isMountRef.current = false;
    }, []);

    return isMountRef.current;
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
    const [lastStartDate, setLastStartDate] = useState('');
    const [lastEndDate, setLastEndDate] = useState('');

    const isMount = useIsMount();

    useEffect(() => {
        const fetchTickets = () => {
            setIsLoading(true);
            setLastStartDate(startDate);
            setLastEndDate(endDate);
            // TODO: replace incidents API call with problem management tickets API call
            Promise.all([fetch(`/api/v1/incidents?startDate=${startDate}&endDate=${endDate}`)])
                .then((responses) => Promise.all(responses.map((r) => r.json())))
                .then(() => {
                    // TODO: temporarily ignore data and replace with mockData
                    setAllTickets(data.map(mapTickets));
                    setIsLoading(false);
                })
                .catch((err) => {
                    setIsLoading(false);
                    setError('Could not retrieve all problem management tickets. Refresh the page to try again.');
                    // eslint-disable-next-line no-console
                    console.error(err);
                });
        };

        if (isMount) {
            fetchTickets();
        } else if (isApplyClicked) {
            if (lastStartDate !== startDate || lastEndDate !== endDate) {
                fetchTickets();
            } else {
                applyFilters();
            }
        }

        return () => {
            setIsApplyClicked(false);
            setCurrentPriorities(['0-Code Red', '1-Critical', '2-High', '3-Medium', '4-Low']); // TODO hardcoded
            setCurrentStatuses(['To Do', 'In Progress', 'Done', 'Resolved', 'Testing', 'Closed']); // TODO hardcoded
            setCurrentTypes(['Corrective Action', 'Incident', 'Post Mortum', 'Resiliency Validation']); // TODO hardcoded
            setCurrentOrgs(['Egencia', 'Platform & Marketplaces']); // TODO hardcoded
            setCurrentRcOwners(['EWE - Air Development', 'Egencia - Hotel Shopping']); // TODO hardcoded
            setCurrentRcCategories(['Architectural']);
        };
    }, [isApplyClicked, startDate, endDate]);

    return [
        isLoading,
        error,
        allTickets
    ];
};
