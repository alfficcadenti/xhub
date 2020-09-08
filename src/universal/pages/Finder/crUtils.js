import React from 'react';
import moment from 'moment/moment';
import Tooltip from '@homeaway/react-tooltip';
import {EG_BRAND, EXPEDIA_BRAND, VRBO_BRAND, HOTELS_COM_BRAND, EGENCIA_BRAND} from '../../constants';

// eslint-disable-next-line complexity
export const platformToBrand = (platform = '') => {
    switch (platform && platform.toUpperCase()) {
        case 'EXPEDIA':
            return EXPEDIA_BRAND;
        case 'EGENCIA NA':
        case 'EGENCIA EU':
        case 'EGENCIA EU,EGENCIA NA':
        case 'EGENCIA':
            return EGENCIA_BRAND;
        case 'VRBO':
        case 'HOMEAWAY':
            return VRBO_BRAND;
        case 'HOTELS':
        case 'HCOM':
            return HOTELS_COM_BRAND;
        default:
            return EG_BRAND;
    }
};

const formatValue = (item) => (item || '-');

export const buildLink = (number = '', url = '') => {
    if (url) {
        return (`<a href="${url}" target="_blank">${number || '-'}</a>`);
    }
    return (number || '-');
};

export const buildServiceNowLink = (id = '', number = '') => {
    if (number) {
        return (`<a href="https://expedia.service-now.com/sp?id=ticket&table=change_request&sys_id=${id}" target="_blank">${number || '-'}</a>`);
    }
    return (id || '-');
};

export const teamEmail = (team = '', contact = '') => <Tooltip fullWidth content={<a href={`mailto:${contact}`}>{contact}</a>}>{formatValue(team)}</Tooltip>;

export const formatCRData = (filteredCRs = []) => filteredCRs
    .map((x) => ({
        'CR Number': buildServiceNowLink(x.id, x.number),
        Application: formatValue(x.applicationName),
        Product: formatValue(x.productName),
        Description: formatValue(x.shortDescription),
        Brand: platformToBrand(x.platform),
        Started: moment.utc(x.openedAt).local().isValid() ? moment.utc(x.openedAt).local().format('YYYY-MM-DD HH:mm') : '-',
        'Business Reason': formatValue(x.businessReason),
        Platform: formatValue(x.platform),
        status: formatValue(x.status),
        Team: (teamEmail(x.team, x.contact)),
        Category: formatValue(x.category),
        Details: (
            <div className="expandable-row-wrapper">
                <div className="expandable-row">
                    <span className="expandable-row-header">{'Business Justification:'}</span>
                    <div className="expandable-row-section">
                        {formatValue(x.businessJustification)}
                    </div>
                    <span className="expandable-row-header">{'Environment:'}</span>
                    <div className="expandable-row-section">
                        {formatValue(x.environmentName)}
                    </div>
                    <span className="expandable-row-header">{'Coordinator:'}</span>
                    <div className="expandable-row-section">
                        {formatValue(x.coordinator)}
                    </div>
                </div>
                <div className="expandable-row">
                    <span className="expandable-row-header">{'Coordinator Group:'}</span>
                    <div className="expandable-row-section">
                        {formatValue(x.coordinatorGroup)}
                    </div>
                    <span className="expandable-row-header">{'Change Class:'}</span>
                    <div className="expandable-row-section">
                        {formatValue(x.changeClass)}
                    </div>
                    <span className="expandable-row-header">{'Created By:'}</span>
                    <div className="expandable-row-section">
                        {formatValue(x.sysCreatedBy)}
                    </div>
                </div>
            </div>
        )
    }))
    .sort((a, b) => moment(a.Started).isBefore(b.Started));

export const adjustCRsProperties = (CRs = []) => {
    return CRs.map((t) => {
        const result = {
            ...t,
            'Brand': platformToBrand(t.platform),
        };
        return result;
    });
};

export const filterArrayFormatted = (inputArray = []) => {
    const uniqueFields = [];
    const arrayNewFormat = [];
    inputArray.forEach((x) => {
        if (x && x.key) {
            if (uniqueFields.indexOf(x.key) === -1) {
                uniqueFields.push(x.key);
                arrayNewFormat.push({key: x.key, values: [x.value]});
            } else {
                arrayNewFormat.find((y) => y.key === x.key).values.push(x.value);
            }
        }
    });
    return arrayNewFormat;
};