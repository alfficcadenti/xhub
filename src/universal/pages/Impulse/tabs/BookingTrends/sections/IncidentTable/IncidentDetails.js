import React from 'react';
import DataTable from '../../../../../../components/DataTable';
import './styles.less';
import {buildTicketLink} from '../../../../../utils';
import {
    INCIDENT_TABLE_COLUMN_HEADERS,
    INCIDENT_TABLE_COLUMNS
} from './constants';

const IncidentDetails = ({data = [], setTableData}) => {
    const setStorageMap = (loss, storedLoss) => {
        return loss !== 'NA' ? [...(storedLoss && storedLoss), loss].filter((item) => typeof item !== 'undefined') : [];
    };
    const renderRevenueImpactDetails = () => {
        let lossStorageMap = {};
        let sumList = [];
        let columnData = data[0].estimatedImpact.map((brand) => {
            return brand.lobs.map((impact) => {
                let rowData = [<div>{brand.brand}</div>];
                rowData.push(<div>{impact.lob}</div>);
                rowData.push(<div>{impact.revenueLoss}</div>);
                rowData.push(<div>{impact.gbvLoss}</div>);
                rowData.push(<div>{impact.orderLoss}</div>);
                lossStorageMap.revloss = setStorageMap(impact.revenueLoss, lossStorageMap.revloss);
                lossStorageMap.gbvloss = setStorageMap(impact.gbvLoss, lossStorageMap.gbvloss);
                lossStorageMap.orderLoss = setStorageMap(impact.orderLoss, lossStorageMap.orderLoss);
                return rowData;
            });
        });
        for (const key of Object.keys(lossStorageMap)) {
            sumList.push(
                <div className="last-sum-row">
                    <strong>{lossStorageMap[key].reduce((acc, sum) => parseInt(acc, 10) + parseInt(sum, 10), 0)}</strong>
                </div>);
        }
        sumList.unshift(<div>{''}</div>);
        sumList.unshift(<div>{''}</div>);
        return [].concat(...columnData, [sumList]).map((item) => ({'cols': item}));
    };

    return (
        <div className="incident-details-container">
            <h2 className="page-title">{buildTicketLink(data[0].id)} {'Details'}</h2>
            <div className="table-wrapper">
                <span className="close-button" onClick={() => setTableData([])}>&#10006;</span>
                <div className="incident-details">
                    <DataTable
                        columns={INCIDENT_TABLE_COLUMNS}
                        columnHeaders={INCIDENT_TABLE_COLUMN_HEADERS}
                        data={data}
                    />
                </div>
                <div className="rev-details">
                    <DataTable
                        headers={[{name: 'Brand'}, {name: 'LOB'}, {name: 'Rev Loss'}, {name: 'GBV Loss'}, {name: 'Order Loss'}]}
                        rows={renderRevenueImpactDetails()}
                        tableConfig={{compact: true}}
                    />
                </div>
            </div>
        </div>);
};

export default React.memo(IncidentDetails);
