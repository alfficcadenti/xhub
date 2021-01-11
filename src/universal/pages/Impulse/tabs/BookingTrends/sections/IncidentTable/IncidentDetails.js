import React from 'react';
import DataTable from '../../../../../../components/DataTable';
import './styles.less';
import {buildTicketLink} from '../../../../../utils';
import {
    INCIDENT_TABLE_COLUMN_HEADERS,
    INCIDENT_TABLE_COLUMNS,
    REVLOSS_TABLE_COLUMN_HEADERS,
    REVLOSS_TABLE_COLUMNS
} from './constants';
import moment from 'moment';

const IncidentDetails = ({data = [], setTableData}) => {
    const getRevenueDetailsData = () => {
        let finalRevLossObj = {};
        let totalOrderLoss = 0;
        let totalRevenueLoss = 0;
        let totalGbvLoss = 0;
        const estimatedImpact = data[0].estimatedImpact;
        finalRevLossObj.revDetails = [].concat(...estimatedImpact.map((impact) => {
            let lobsArr = impact.lobs;
            return lobsArr.map((obj) => ({...obj, brand: impact.brand}));
        })).filter((lob) => lob.orderLoss !== 'NA');

        finalRevLossObj.revDetails.forEach((lobObj) => {
            totalOrderLoss += Number(lobObj.orderLoss);
            totalRevenueLoss += Number(lobObj.revenueLoss);
            totalGbvLoss += Number(lobObj.gbvLoss);
        });

        finalRevLossObj.totalOrderLoss = totalOrderLoss;
        finalRevLossObj.totalReveueLoss = totalRevenueLoss;
        finalRevLossObj.totalgbvLoss = totalGbvLoss;
        return finalRevLossObj;
    };

    const formatIncidentData = () => {
        data[0].startDateIST = moment.utc(data[0].startDate).local().format('MM/DD HH:mm');
        data[0].endDateIST = moment.utc(data[0].endDate).local().format('MM/DD HH:mm');
        return data;
    };

    const revDetailsData = getRevenueDetailsData();
    return (
        <div className="incident-details-container">
            <h3 className="page-title">{buildTicketLink(data[0].id)} {'Details'}</h3>
            <div className="table-wrapper">
                <span className="close-button" onClick={() => setTableData([])}>&#10006;</span>
                <div className="incident-details">
                    <DataTable
                        columns={INCIDENT_TABLE_COLUMNS}
                        columnHeaders={INCIDENT_TABLE_COLUMN_HEADERS}
                        data={formatIncidentData()}
                    />
                </div>
            </div>
            <br/>
            <h3 className="page-title"> {'Revenue Details'}</h3>
            <div className="table-wrapper">
                <div className="rev-details">
                    <DataTable
                        columns={REVLOSS_TABLE_COLUMNS}
                        columnHeaders = {REVLOSS_TABLE_COLUMN_HEADERS}
                        data = {revDetailsData.revDetails}
                    />
                    {revDetailsData.revDetails.length !== 0 && <span style={{paddingLeft: '35%'}}><strong> {'Total Revenue Loss :'}</strong> {revDetailsData.totalReveueLoss}</span>}
                    {revDetailsData.revDetails.length !== 0 && <span style = {{paddingLeft: '5%'}}><strong>{'Total Gbv Loss :'}</strong>{revDetailsData.totalgbvLoss}</span>}
                    {revDetailsData.revDetails.length !== 0 && <span style = {{paddingLeft: '5%'}}><strong>{'Total Order Loss :'}</strong>{revDetailsData.totalOrderLoss}</span>}
                </div>
            </div>
        </div>);
};

export default React.memo(IncidentDetails);
