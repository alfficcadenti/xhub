import React from 'react';
import DataTable from '../../../../../../components/DataTable';
import {
    ANOMALY_TABLE_COLUMN_HEADERS,
    ANOMALY_TABLE_COLUMNS
} from './constants';

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
            changePercentage: getPercentage(impactObj)
        }));
        finalAnomalyData.forEach((anomalyObj) => {
            if (anomalyObj.deviceType === 'null') {
                anomalyObj.deviceType = 'NA';
            }
        });
        return finalAnomalyData;
    };

    return (
        <div className="incident-details-container">
            <h3 className="page-title">{'Anomaly Details'}</h3>
            <div className="table-wrapper">
                <span className="close-button" onClick={() => setAnomalyTableData([])}>&#10006;</span>
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
