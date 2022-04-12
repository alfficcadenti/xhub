import React from 'react';
import {SVGIcon} from '@homeaway/react-svg';
import {CLOSE__24} from '@homeaway/svg-defs';
import DataTable from '../../../../../../components/DataTable';
import {
    ANOMALY_TABLE_COLUMN_HEADERS,
    ANOMALY_TABLE_COLUMNS
} from './constants';
import moment from 'moment';

const AnomalyDetails = ({data = [], setAnomalyTableData}) => {
    const getPercentage = (impactObj) => {
        let count = Number(impactObj.count);
        let predicted = Number(impactObj.predicted);
        let percentage = ((count - predicted) / predicted) * 100;
        return `${Math.round(percentage)}%`;
    };

    const formatAnomalyData = () => {
        let finalAnomalyData = data[0].impact.map((impactObj) => ({
            ...impactObj,
            changePercentage: getPercentage(impactObj),
            timestamp: `${moment(data[0].timestamp).format('YYYY-MM-DD HH:mm')} ${moment().tz?.(moment.tz.guess()).format('z')}`
        }));
        return finalAnomalyData;
    };

    const handleOnClose = () => setAnomalyTableData([]);

    return (
        <div className="incident-details-container">
            <div className="table-wrapper">
                <strong>{data[0].category}</strong>
                <span className="close-button" onClick={handleOnClose} onKeyUp={handleOnClose} role="button" tabIndex="0">
                    <SVGIcon usefill markup={CLOSE__24} />
                </span>
                <div className="incident-details">
                    <DataTable
                        columns={ANOMALY_TABLE_COLUMNS}
                        columnHeaders={ANOMALY_TABLE_COLUMN_HEADERS}
                        data={formatAnomalyData()}
                    />
                </div>
            </div>
        </div>
    );
};

export default React.memo(AnomalyDetails);
