import React from 'react';
import DataTable from '@homeaway/react-data-table';
import './styles.less';
import moment from 'moment';
import {buildTicketLink} from '../../../../../utils';

const IncidentDetails = ({data = [], setTableData}) => {
    const renderIncidentDetails = (header, key) => {
        return [<div><strong>{header}</strong></div>,
            <div>{key === 'startDate' || key === 'endDate' ? moment(data[0][key]).format('MM/DD HH:mm') : data[0][key]}</div>];
    };
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
                <span className="closeButton" onClick={() => setTableData([])}>&#10006;</span>
                <div className="incident-details">
                    <DataTable
                        rows={[
                            {cols: renderIncidentDetails('Summary', 'summary')},
                            {cols: renderIncidentDetails('Root Cause', 'rootCause')},
                            {cols: renderIncidentDetails('Brand', 'brand')},
                            {cols: renderIncidentDetails('Start Date', 'startDate')},
                            {cols: renderIncidentDetails('End Date', 'endDate')},
                            {cols: renderIncidentDetails('Status', 'status')},
                            {cols: renderIncidentDetails('Priority', 'priority')},
                            {cols: renderIncidentDetails('Booking Impact', 'bookingImpact')},
                        ]}
                        tableConfig={{compact: true}}
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
