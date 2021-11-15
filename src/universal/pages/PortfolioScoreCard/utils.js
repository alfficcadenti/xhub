import React from 'react';
import moment from 'moment';
import qs from 'query-string';
import {DATE_FORMAT} from '../../constants';
import {getOrDefault} from '../../utils';
import {validDateRange, getTableNumValue, buildTicketLink} from '../utils';


export const formatPercentage = (percent) => percent === null ? '-' : `${percent}%`;

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

export const mapOrgDetails = (row, handleSelectOrg, handleSelectTickets) => ({
    org: row.name || '',
    Organization: (
        <div
            className={`${row.subOrgDetails?.length ? 'link' : ''}`}
            role="link"
            tabIndex="0"
            onClick={() => handleSelectOrg(row.name, row.businessOwnerType, row.subOrgDetails)}
            onKeyUp={(e) => e.key === 'Enter' && handleSelectOrg(row.name, row.businessOwnerType, row.subOrgDetails)}
        >
            {row.name}
        </div>
    ),
    P1: (
        <div
            className={`${row.p1IncidentCount ? 'link' : ''}`}
            role="link"
            tabIndex="0"
            onClick={() => handleSelectTickets(row.p1IncidentCount, 'p1', row.name, row.businessOwnerType)}
            onKeyUp={(e) => e.key === 'Enter' && handleSelectTickets(row.p1IncidentCount, 'p1', row.name, row.businessOwnerType)}
        >
            {row.p1IncidentCount}
        </div>
    ),
    P2: (
        <div
            className={`${row.p2IncidentCount ? 'link' : ''}`}
            role="link"
            tabIndex="0"
            onClick={() => handleSelectTickets(row.p2IncidentCount, 'p2', row.name, row.businessOwnerType)}
            onKeyUp={(e) => e.key === 'Enter' && handleSelectTickets(row.p2IncidentCount, 'p2', row.name, row.businessOwnerType)}
        >
            {row.p2IncidentCount}
        </div>
    ),
    'TTD<=15m': formatPercentage(row.percentIncidentsTtdWithin15MinSlo),
    'TTF<=15m': formatPercentage(row.percentIncidentsTtfWithin15MinSlo),
    'TTK<=30m': formatPercentage(row.percentIncidentsTtkWithin30MinSlo),
    'TTR<=60m': formatPercentage(row.percentIncidentsTtrWithin60MinSlo),
    'Corrective Actions': row.correctiveActionsTicketCount
});

export const mapTicketDetails = (ticketDetails = []) => {
    return ticketDetails.map((ticketDetail) => ({
        Number: buildTicketLink(getOrDefault(ticketDetail, 'number')),
        Priority: getOrDefault(ticketDetail, 'priority'),
        Title: getOrDefault(ticketDetail, 'title'),
        'Time To Detect': getTableNumValue(ticketDetail, 'timeToDetect'),
        'Time To Know': getTableNumValue(ticketDetail, 'timeToKnow'),
        'Time To Fix': getTableNumValue(ticketDetail, 'timeToFix'),
        'Time To Restore': getTableNumValue(ticketDetail, 'timeToRestore'),
    }));
};
