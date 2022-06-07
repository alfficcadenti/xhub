import React from 'react';
import moment from 'moment/moment';
import Tooltip from '@homeaway/react-tooltip';
import {EG_BRAND, EGENCIA_BRAND, EXPEDIA_BRAND, HOTELS_COM_BRAND, VRBO_BRAND} from '../../constants';
import {getOrDefault} from '../../utils';

// eslint-disable-next-line complexity
export const platformToBrand = (platform) => {
    switch (`${platform.toUpperCase()}`) {
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

export const buildLink = (number = '', url = '') => {
    if (url) {
        return (`<a href="${url}" target="_blank" rel="noopener noreferrer">${number || '-'}</a>`);
    }
    return (number || '-');
};

export const buildServiceNowLink = (id = '', number = '') => {
    if (number) {
        return (`<a href="https://expedia.service-now.com/sp?id=ticket&table=change_request&sys_id=${id}" target="_blank" rel="noopener noreferrer">${number || '-'}</a>`);
    }
    return (id || '-');
};

export const teamEmail = (team = '', contact = '') => <Tooltip fullWidth content={<a href={`mailto:${contact}`}>{contact}</a>}>{team || '-'}</Tooltip>;

export const formatCRData = (filteredCRs = []) => filteredCRs
    .map((x) => ({
        'CR Number': buildServiceNowLink(x.id, x.number),
        Application: getOrDefault(x, 'application_name'),
        Product: getOrDefault(x, 'product_name'),
        Description: getOrDefault(x, 'short_description'),
        Brand: platformToBrand(x.platform),
        Started: moment.utc(x.opened_at).local().isValid() ? moment.utc(x.opened_at).local().format('YYYY-MM-DD HH:mm') : '-',
        'Business Reason': getOrDefault(x, 'business_reason'),
        Platform: getOrDefault(x, 'platform'),
        status: getOrDefault(x, 'status'),
        Team: (teamEmail(x.team, x.contact)),
        Category: getOrDefault(x, 'category'),
        Details: (
            <div className="expandable-row-wrapper">
                <div className="expandable-row">
                    <span className="expandable-row-header">{'Business Justification:'}</span>
                    <div className="expandable-row-section">
                        {getOrDefault(x, 'business_justification')}
                    </div>
                    <span className="expandable-row-header">{'Environment:'}</span>
                    <div className="expandable-row-section">
                        {getOrDefault(x, 'environment_name')}
                    </div>
                    <span className="expandable-row-header">{'Coordinator:'}</span>
                    <div className="expandable-row-section">
                        {getOrDefault(x, 'coordinator')}
                    </div>
                </div>
                <div className="expandable-row">
                    <span className="expandable-row-header">{'Coordinator Group:'}</span>
                    <div className="expandable-row-section">
                        {getOrDefault(x, 'coordinator_group')}
                    </div>
                    <span className="expandable-row-header">{'Change Class:'}</span>
                    <div className="expandable-row-section">
                        {getOrDefault(x, 'change_class')}
                    </div>
                    <span className="expandable-row-header">{'Created By:'}</span>
                    <div className="expandable-row-section">
                        {getOrDefault(x, 'sys_created_by')}
                    </div>
                </div>
            </div>
        )
    }))
    .sort((a, b) => moment(a.Started).isBefore(b.Started));

export const formatABTestsData = (abTests = []) => abTests
    .map((x) => ({
        'A/B Tests Number': buildServiceNowLink(x.id, x.number),
        Application: getOrDefault(x, 'service_name'),
        Description: getOrDefault(x.ab_test_details, 'description'),
        Brand: platformToBrand(x.platform),
        Started: moment.utc(x.opened_at).local().isValid() ? moment.utc(x.opened_at).local().format('YYYY-MM-DD HH:mm') : '-',
        'Business Reason': getOrDefault(x, 'business_reason'),
        Platform: getOrDefault(x, 'platform'),
        status: getOrDefault(x.ab_test_details, 'status'),
        Details: (
            <div className="expandable-row-wrapper">
                <div className="expandable-row">
                    <span className="expandable-row-header">{'Business Justification:'}</span>
                    <div className="expandable-row-section">
                        {getOrDefault(x, 'business_justification')}
                    </div>
                    <span className="expandable-row-header">{'Environment:'}</span>
                    <div className="expandable-row-section">
                        {getOrDefault(x, 'environment_name')}
                    </div>
                    <span className="expandable-row-header">{'Experiment Id:'}</span>
                    <div className="expandable-row-section">
                        <a className="experiment-link" href={`https://egtnl.prod.expedia.com/experiment/${x.abTestDetails?.experiment_id}`} target="_blank">{x.abTestDetails?.experiment_name}</a>
                    </div>
                </div>
                <div className="expandable-row">
                    <span className="expandable-row-header">{'Owner:'}</span>
                    <div className="expandable-row-section">
                        {getOrDefault(x.ab_test_details, 'owner')}
                    </div>
                    <span className="expandable-row-header">{'Experiment Name:'}</span>
                    <div className="expandable-row-section">
                        {getOrDefault(x.ab_test_details, 'experiment_name')}
                    </div>
                    <span className="expandable-row-header">{'Status:'}</span>
                    <div className="expandable-row-section">
                        {getOrDefault(x.ab_test_details, 'status')}
                    </div>
                </div>
            </div>
        )
    })
    ).sort((a, b) => moment(a.Started).isBefore(b.Started));

export const adjustCRsProperties = (CRs = []) => CRs.map((t) => ({
    ...t,
    Brand: platformToBrand(t.platform),
}));
