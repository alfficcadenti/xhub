import moment from 'moment';
import qs from 'query-string';
import {DATE_FORMAT} from '../../constants';
import {validDateRange, getTableValue, buildTicketLink} from '../utils';
import React from 'react';


// eslint-disable-next-line complexity
export const getQueryValues = (search) => {
    const {start, end} = qs.parse(search);
    const isValidDateRange = validDateRange(start, end);

    return {
        initialStart: isValidDateRange
            ? moment(start).format(DATE_FORMAT)
            : moment().subtract(1, 'years').startOf('minute').format(DATE_FORMAT),
        initialEnd: isValidDateRange
            ? moment(end).format(DATE_FORMAT)
            : moment().format(DATE_FORMAT)
    };
};

const addPercentageSign = (value) => {
    return value === '-' ? '-' : `${value}%`;
};

export const detectThreshold = (value) => {
    return value >= 75 ? 'under-threshold' : '';
};

export const mapDetails = (
    setTicketDetailsBusinessOwnerType,
    setTicketDetailsOrgName,
    setIsTicketDetailsModalOpen,
    row
) => {
    const ttdValue = getTableValue(row, 'percentIncidentsTtdWithin15MinSlo');
    const ttfValue = getTableValue(row, 'percentIncidentsTtfWithin15MinSlo');
    const ttkValue = getTableValue(row, 'percentIncidentsTtkWithin30MinSlo');
    const ttrValue = getTableValue(row, 'percentIncidentsTtrWithin60MinSlo');
    const isP1HasIncidents = row.p1IncidentCount > 0;

    return {
        Name: <span className={`link ${row.isDisabled ? 'disabled' : ''}`} onClick={() => row.showDetails(null, row.subOrgDetails, row.name, row.businessOwnerType)}>{getTableValue(row, 'name')}</span>,
        P1: (<span
            className={isP1HasIncidents ? 'link' : 'disabled'}
            onClick={() => {
                if (isP1HasIncidents) {
                    setTicketDetailsBusinessOwnerType(row.businessOwnerType);
                    setTicketDetailsOrgName(row.name);
                    setIsTicketDetailsModalOpen(true);
                }
            }}
        >{getTableValue(row, 'p1IncidentCount')}
        </span>),
        P2: getTableValue(row, 'p2IncidentCount'),
        ['TTD<=15M']: <span className={`${detectThreshold(ttdValue)}`}>{addPercentageSign(ttdValue)}</span>,
        ['TTF<=15M']: <span className={`${detectThreshold(ttfValue)}`}>{addPercentageSign(ttfValue)}</span>,
        ['TTK<=30M']: <span className={`${detectThreshold(ttkValue)}`}>{addPercentageSign(ttkValue)}</span>,
        ['TTR<=30M']: <span className={`${detectThreshold(ttrValue)}`}>{addPercentageSign(ttrValue)}</span>
    };
};

export const findCorrectLName = (lName) => ({name}) => name === lName;

export const findSubOrgDetails = (data, lName) => data
    .find(findCorrectLName(lName))
    ?.subOrgDetails;

export const doesHaveSubOrgs = (lName, businessOwnerType, l2Data, l3Data, l4Data) => {
    let result;

    if (businessOwnerType === 'l1') {
        result = !!findSubOrgDetails(l2Data, lName)?.length;
    } else if (businessOwnerType === 'l2') {
        result = !!findSubOrgDetails(l3Data, lName)?.length;
    } else if (businessOwnerType === 'l3') {
        result = !!findSubOrgDetails(l4Data, lName)?.length;
    } else {
        result = false;
    }

    return result;
};

export const getCurrentSubOrgDetails = (lName, businessOwnerType, l2Data, l3Data, l4Data) => {
    let result;

    if (businessOwnerType === 'l1') {
        result = findSubOrgDetails(l2Data, lName);
    } else if (businessOwnerType === 'l2') {
        result = findSubOrgDetails(l3Data, lName);
    } else if (businessOwnerType === 'l3') {
        result = findSubOrgDetails(l4Data, lName);
    } else {
        result = [];
    }

    return result;
};

export const getNextL = (currentySelectedL) => {
    const currentLDigit = currentySelectedL.split('')[1];
    return `L${parseInt(currentLDigit, 10) + 1}`;
};

export const mapTicketDetails = (ticketDetails = []) => {
    return ticketDetails.map((ticketDetail) => ({
        Number: buildTicketLink(getTableValue(ticketDetail, 'number')),
        Priority: getTableValue(ticketDetail, 'priority'),
        Title: getTableValue(ticketDetail, 'title'),
        'Time To Detect': getTableValue(ticketDetail, 'timeToDetect'),
        'Time To Know': getTableValue(ticketDetail, 'timeToKnow'),
        'Time To Fix': getTableValue(ticketDetail, 'timeToFix'),
        'Time To Restore': getTableValue(ticketDetail, 'timeToRestore'),
    }));
};
