import React from 'react';
import moment from 'moment/moment';
import Tooltip from '@homeaway/react-tooltip';
import {EG_BRAND, EGENCIA_BRAND, EXPEDIA_BRAND, HOTELS_COM_BRAND, VRBO_BRAND} from '../../constants';

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

export const formatABTestsData = (abTests = []) => abTests
    .map((x) => ({
        'A/B Tests Number': buildServiceNowLink(x.id, x.number),
        Application: formatValue(x.serviceName),
        Description: formatValue(x.abTestDetails.description),
        Brand: platformToBrand(x.platform),
        Started: moment.utc(x.openedAt).local().isValid() ? moment.utc(x.openedAt).local().format('YYYY-MM-DD HH:mm') : '-',
        'Business Reason': formatValue(x.businessReason),
        Platform: formatValue(x.platform),
        status: formatValue(x.abTestDetails.status),
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
                    <span className="expandable-row-header">{'Experiment Id:'}</span>
                    <div className="expandable-row-section">
                        <a className="experiment-link" href={`https://egtnl.prod.expedia.com/experiment/${x.abTestDetails.experimentId}`} target="_blank">{x.abTestDetails.experimentName}</a>
                    </div>
                </div>
                <div className="expandable-row">
                    <span className="expandable-row-header">{'Owner:'}</span>
                    <div className="expandable-row-section">
                        {formatValue(x.abTestDetails.owner)}
                    </div>
                    <span className="expandable-row-header">{'Experiment Name:'}</span>
                    <div className="expandable-row-section">
                        {formatValue(x.abTestDetails.experimentName)}
                    </div>
                    <span className="expandable-row-header">{'Status:'}</span>
                    <div className="expandable-row-section">
                        {formatValue(x.abTestDetails.status)}
                    </div>
                </div>
            </div>
        )
    }))
    .sort((a, b) => moment(a.Started).isBefore(b.Started));

export const adjustCRsProperties = (CRs = []) => CRs.map((t) => ({
    ...t,
    Brand: platformToBrand(t.platform),
}));
