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
import {DATE_FORMAT} from '../../constants';

export const CA_STATUS_LIST = [
    {value: 'Done', label: 'Done'},
    {value: 'In Progress', label: 'In Progress'},
    {value: 'Blocked', label: 'Blocked'},
    {value: 'Open', label: 'Open'}
];

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

const getCAOrgName = (selectedOrg) => (selectedOrg || {}).name;

export const generateUrl = (
    selectedBrands,
    startDate,
    endDate,
    selectedL1,
    selectedL2,
    selectedL3,
    selectedL4
) => {
    return `/prb/`
        + `?selectedBrand=${selectedBrands[0]}`
        + `&start=${startDate}`
        + `&end=${endDate}`
        + `${getUrlParam('l1', getCAOrgName(selectedL1), null)}`
        + `${getUrlParam('l2', getCAOrgName(selectedL2), null)}`
        + `${getUrlParam('l3', getCAOrgName(selectedL3), null)}`
        + `${getUrlParam('l4', getCAOrgName(selectedL4), null)}`;
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

export const getTableValue = (row, property) => row && property ? row[property] || '-' : '-';

export const mapDetails = (row) => ({
    Name: getTableValue(row, 'name'),
    P1: getTableValue(row, 'p1IncidentCount'),
    P2: getTableValue(row, 'p2IncidentCount'),
    ['TTD<=15M']: getTableValue(row, 'percentIncidentsTtdWithin15MinSlo'),
    ['TTF<=15M']: getTableValue(row, 'percentIncidentsTtfWithin15MinSlo'),
    ['TTD<=30M']: getTableValue(row, 'percentIncidentsTtkWithin30MinSlo'),
    ['TTR<=30M']: getTableValue(row, 'percentIncidentsTtrWithin60MinSlo')
});

// eslint-disable-next-line complexity
export const checkIsRowSelected = (businessOwnerType, selectedL1, selectedL2, selectedL3, selectedL4, name) => (
    (businessOwnerType === 'l1' && selectedL1 !== null && selectedL1.name === name)
    || (selectedL1 !== null && businessOwnerType === 'l2' && selectedL2 !== null && selectedL2.name === name)
    || (selectedL2 !== null && businessOwnerType === 'l3' && selectedL3 !== null && selectedL3.name === name)
    || (selectedL3 !== null && businessOwnerType === 'l4' && selectedL4 !== null && selectedL4.name === name)
);
