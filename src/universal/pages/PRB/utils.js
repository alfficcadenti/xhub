import React from 'react';
import moment from 'moment';
import qs from 'query-string';
import DataTable from '../../components/DataTable';
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


// eslint-disable-next-line complexity
export const validDateRange = (start, end) => {
    if (!start || !end) {
        return false;
    }
    const startMoment = moment(start);
    const endMoment = moment(end);
    return startMoment.isValid() && endMoment.isValid() && startMoment.isBefore(new Date()) && endMoment.isAfter(startMoment);
};


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
        ca
    } = qs.parse(search);
    const isValidDateRange = validDateRange(start, end);
    return {
        initialStart: isValidDateRange
            ? moment(start).format('YYYY-MM-DD')
            : moment().subtract(30, 'days').startOf('minute').format('YYYY-MM-DD'),
        initialEnd: isValidDateRange
            ? moment(end).format('YYYY-MM-DD')
            : moment().format('YYYY-MM-DD'),
        initialType: type || ALL_TYPES_OPTION,
        initialStatus: status || ALL_STATUSES_OPTION,
        initialPriority: priority || ALL_PRIORITIES_OPTION,
        initialOrg: org || ALL_ORGS_OPTION,
        initialRcOwner: rcowner || ALL_RC_OWNERS_OPTION,
        initialRcCategory: rccategory || ALL_RC_CATEGORIES_OPTION,
        initialCAStatuses: castatus
            ? castatus.split(',').map((l) => CA_STATUS_LIST.find(({value}) => value === l)).filter((l) => l)
            : CA_STATUS_LIST.filter(({value}) => ['In Progress', 'Open', 'Blocked'].includes(value)),
        initialL1: l1,
        initialL2: l2,
        initialCA: ca
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
    selectedCA
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
        + `${getUrlParam('l1', (selectedL1 || {}).name, null)}`
        + `${getUrlParam('l2', (selectedL2 || {}).name, null)}`
        + `${getUrlParam('ca', (selectedCA || {}).name, null)}`;
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
