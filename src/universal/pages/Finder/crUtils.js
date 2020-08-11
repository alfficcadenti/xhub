import React from 'react';
import moment from 'moment/moment';
import {divisionToBrand} from '../utils';

const formatValue = (item) => (item || '-');

export const buildLink = (id = '', url = '') => {
    if (url) {
        return (`<a href="${url}" target="_blank">${id || '-'}</a>`);
    }
    return (id || '-');
};

export const formatCRData = (filteredCRs = []) => filteredCRs
    .map((x) => ({
        id: x.id,
        'CR Number': buildLink(x.number, x.repo),
        Priority: formatValue(x.priority),
        'Brand': formatValue(x.Brand),
        'Division': formatValue(x.Division),
        Opened: moment.utc(x.openedAt).local().isValid() ? moment.utc(x.openedAt).local().format('YYYY-MM-DD HH:mm') : '-',
        'Business Reason': formatValue(x.businessReason),
        'Service Name': formatValue(x.serviceName),
        Platform: formatValue(x.platform),
        'Version': formatValue(x.version),
        'Team': formatValue(x.team),
        'Product': formatValue(x.product),
        'Category': formatValue(x.category),
        Details: (
            <div className="expandable-row-wrapper">
                <div className="expandable-row">
                    <span className="expandable-row-header">{'Change Request Description:'}</span>
                    <div className="expandable-row-section">
                        {formatValue(x.businessJustification)}
                    </div>
                    <span className="expandable-row-header">{'Environment:'}</span>
                    <div className="expandable-row-section">
                        {formatValue(x.environmentName)}
                    </div>
                    <span className="expandable-row-header">{'Region:'}</span>
                    <div className="expandable-row-section">
                        {formatValue(x.region)}
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
            'Brand': divisionToBrand(t.brand),
            'Division': t.brand,
        };
        return result;
    });
};
