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

export const useFetchTickets = (
    isApplyClicked,
    startDate,
    endDate,
    applyFilters,
    setIsApplyClicked
) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [lastStartDate, setLastStartDate] = useState();
    const [lastEndDate, setLastEndDate] = useState();

    const fetchTickets = () => {
        setIsLoading(true);
        setLastStartDate(startDate);
        setLastEndDate(endDate);
        // TODO: replace incidents API call with problem management tickets API call
        // fetch(`/v1/prbs?fromDate=${startDate}&toDate=${endDate}`)
        fetch(`/v1/org-metrics/business-owner-type/l1?fromDate=${startDate}&toDate=${endDate}`)
            .then(checkResponse)
            .then(({data}) => {
                console.log(data);
                setIsLoading(false);
            })
            .catch((err) => {
                setIsLoading(false);
                setError('Could not retrieve all problem management tickets. Refresh the page to try again.');
                // eslint-disable-next-line no-console
                console.error(err);
            });
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    useEffect(() => {
        if (isApplyClicked) {
            if (!moment(startDate).isSame(lastStartDate) || !moment(endDate).isSame(lastEndDate)) {
                fetchTickets();
            } else {
                applyFilters();
            }
        }

        return () => {
            setIsApplyClicked(false);
        };
    }, [isApplyClicked]);

    return [
        isLoading,
        error
    ];
};
