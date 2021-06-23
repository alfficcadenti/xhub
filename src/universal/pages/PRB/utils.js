import React from 'react';
import DataTable from '../../components/DataTable';
import moment from 'moment';
import qs from 'query-string';
import HelpText from '../../components/HelpText/HelpText';
import {
    ALL_STATUSES_OPTION,
    ALL_PRIORITIES_OPTION,
    ALL_TYPES_OPTION,
    ALL_ORGS_OPTION,
    ALL_RC_OWNERS_OPTION,
    ALL_RC_CATEGORIES_OPTION,
    EPIC_ISSUE_TYPE
} from '../../constants';
import {CA_STATUS_LIST} from './constants';
import {DATE_FORMAT} from '../../constants';
import {validDateRange} from '../utils';


// eslint-disable-next-line complexity
export const getQueryValues = (search) => {
    const {
        start,
        end,
        type,
        status,
        priority,
        org,
        rcowner,
        rccategory,
        castatus,
        l1,
        l2,
        l3,
        l4
    } = qs.parse(search);
    const isValidDateRange = validDateRange(start, end);
    return {
        initialStart: isValidDateRange
            ? moment(start).format(DATE_FORMAT)
            : moment().subtract(1, 'years').startOf('minute').format(DATE_FORMAT),
        initialEnd: isValidDateRange
            ? moment(end).format(DATE_FORMAT)
            : moment().format(DATE_FORMAT),
        initialType: type || ALL_TYPES_OPTION,
        initialStatus: status || ALL_STATUSES_OPTION,
        initialPriority: priority || ALL_PRIORITIES_OPTION,
        initialOrg: org || ALL_ORGS_OPTION,
        initialRcOwner: rcowner || ALL_RC_OWNERS_OPTION,
        initialRcCategory: rccategory || ALL_RC_CATEGORIES_OPTION,
        initialCAStatuses: castatus
            ? castatus.split(',').map((l) => CA_STATUS_LIST.find(({value}) => value === l)).filter((l) => l)
            : CA_STATUS_LIST.filter(({value}) => ['In Progress', 'Open', 'Blocked'].includes(value)),
        initialCAOrgs: {
            l1, l2, l3, l4
        }
    };
};

export const getUrlParam = (label, value, defaultValue) => {
    return value && value !== defaultValue
        ? `&${label}=${encodeURIComponent(value)}`
        : '';
};

export const mapActiveIndexToTabName = (idx) => {
    if (idx === 1) {
        return 'tickets';
    }
    if (idx === 2) {
        return 'corrective-actions';
    }
    return 'overview';
};

const getCAOrgName = (selectedOrg) => (selectedOrg || {}).name;

export const generateUrl = (
    activeIndex,
    selectedBrands,
    startDate,
    endDate,
    selectedType,
    selectedStatus,
    selectedPriority,
    selectedOrg,
    selectedRcOwner,
    selectedRcCategory,
    selectedCAStatuses,
    selectedL1,
    selectedL2,
    selectedL3,
    selectedL4
) => {
    return `/prb/${mapActiveIndexToTabName(activeIndex)}`
        + `?selectedBrand=${selectedBrands[0]}`
        + `&start=${startDate}`
        + `&end=${endDate}`
        + `${getUrlParam('type', selectedType, ALL_TYPES_OPTION)}`
        + `${getUrlParam('status', selectedStatus, ALL_STATUSES_OPTION)}`
        + `${getUrlParam('priority', selectedPriority, ALL_PRIORITIES_OPTION)}`
        + `${getUrlParam('org', selectedOrg, ALL_ORGS_OPTION)}`
        + `${getUrlParam('rcowner', selectedRcOwner, ALL_RC_OWNERS_OPTION)}`
        + `${getUrlParam('rccategory', selectedRcCategory, ALL_RC_CATEGORIES_OPTION)}`
        + `${getUrlParam('castatus', selectedCAStatuses.map(({value}) => value).join(','), [])}`
        + `${getUrlParam('l1', getCAOrgName(selectedL1), null)}`
        + `${getUrlParam('l2', getCAOrgName(selectedL2), null)}`
        + `${getUrlParam('l3', getCAOrgName(selectedL3), null)}`
        + `${getUrlParam('l4', getCAOrgName(selectedL4), null)}`;
};

export const getActiveIndex = (pathname = '') => {
    if (pathname.includes('prb/overview')) {
        return 0;
    }
    if (pathname.includes('prb/tickets')) {
        return 1;
    }
    if (pathname.includes('prb/corrective-actions')) {
        return 2;
    }
    return 0;
};

const renderDetail = (label, value) => {
    return (
        <>
            <div className="details-label">{label}</div>
            <div className="details-value">{value || '-'}</div>
        </>
    );
};

export const filterType = (tickets, selectedType) => {
    let result = [];
    const matchesType = (i) => selectedType === ALL_TYPES_OPTION || !i['Issue Type'].localeCompare(selectedType);
    // eslint-disable-next-line complexity
    tickets.forEach((t) => {
        const ticket = t;
        const {linkedIssues = [], brandsAffected = [], linesOfBusinessImpacted} = ticket;
        const filteredLinkedIssues = linkedIssues.filter(matchesType);
        if (selectedType !== EPIC_ISSUE_TYPE && filteredLinkedIssues.length > 0) {
            ticket['Linked Issues'] = (
                <>
                    <h3>{'Details'}</h3>
                    <div className="details-container">
                        {renderDetail('Brands Affected:', brandsAffected.join(', '))}
                        {renderDetail('Lines of Business Impacted:', linesOfBusinessImpacted)}
                    </div>
                    <h3>
                        {'Linked Issues'}
                        <HelpText className="page-info" text="Each PRB has a number of follow-up items and other correlations that are tracked through other Jira ticket types" />
                    </h3>
                    <DataTable
                        className="linked-issues__table"
                        data={filteredLinkedIssues}
                        columns={['Ticket', 'Summary', 'Issue Type', 'Status', 'Assignee']}
                        expandableColumns={['Linked Issues']}
                    />
                </>
            );
            result.push(ticket);
        } else if (selectedType === ALL_TYPES_OPTION || selectedType === 'Epic') {
            ticket['Linked Issues'] = null;
            result.push(ticket);
        }
    });
    return result;
};

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
export const mapTickets = (t) => {
    const linkedIssues = (t.linkedIssues || []).map(mapLinkedIssues);
    return ({
        Ticket: `<a href="https://jira.expedia.biz/browse/${t.id}" target="_blank">${t.id}</a>`,
        Priority: t.priority,
        Opened: !t.createdDate ? '-' : moment(t.createdDate).format('YYYY-MM-DD HH:mm'),
        'Epic Name': t.summary,
        'Owning Org': t.owningOrganization,
        'RC Owner': t.rootCauseOwner,
        'RC Category': t.rootCauseCategory || '-',
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