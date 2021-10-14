import React from 'react';
import {SVGIcon} from '@homeaway/react-svg';
import {CLOSE__24} from '@homeaway/svg-defs';
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
            lobObj.revenueLoss = `$${Math.round(lobObj.revenueLoss).toLocaleString()}`;
            lobObj.gbvLoss = `$${Math.round(lobObj.gbvLoss).toLocaleString()}`;
        });

        finalRevLossObj.totalOrderLoss = totalOrderLoss.toLocaleString();
        finalRevLossObj.totalReveueLoss = `$${totalRevenueLoss.toLocaleString()}`;
        finalRevLossObj.totalgbvLoss = `$${totalGbvLoss.toLocaleString()}`;
        return finalRevLossObj;
    };

    const formatIncidentData = () => {
        data[0].zoneStartDate = moment.utc(data[0].startDate).local().format('MM/DD HH:mm');
        data[0].zoneEndDate = moment.utc(data[0].endDate).local().format('MM/DD HH:mm');
        return data;
    };

    const handleOnClose = () => setTableData([]);

    const revDetailsData = getRevenueDetailsData();
    return (
        <div className="incident-details-container">
            <div className="table-wrapper">
                <strong>{buildTicketLink(data[0].id)} {'Details'}</strong>
                <span className="close-button" onClick={handleOnClose} onKeyUp={handleOnClose} role="button" tabIndex="0">
                    <SVGIcon usefill markup={CLOSE__24} />
                </span>
                <div className="incident-details">
                    <DataTable
                        columns={INCIDENT_TABLE_COLUMNS}
                        columnHeaders={INCIDENT_TABLE_COLUMN_HEADERS}
                        data={formatIncidentData()}
                    />
                </div>
            </div>
            <br/>
            <div className="table-wrapper">
                <div className="rev-details">
                    <strong>{'Revenue Details'}</strong>
                    <DataTable
                        columns={REVLOSS_TABLE_COLUMNS}
                        columnHeaders = {REVLOSS_TABLE_COLUMN_HEADERS}
                        data = {revDetailsData.revDetails}
                    />
                    {revDetailsData.revDetails.length !== 0 && <span style ={{paddingLeft: '35%'}}><strong>{'Total Order Loss: '}</strong>{revDetailsData.totalOrderLoss}</span>}
                    {revDetailsData.revDetails.length !== 0 && <span style={{paddingLeft: '5%'}}><strong> {'Total Revenue Loss: '}</strong>{revDetailsData.totalReveueLoss}</span>}
                    {revDetailsData.revDetails.length !== 0 && <span style ={{paddingLeft: '5%'}}><strong>{'Total Gbv Loss: '}</strong>{revDetailsData.totalgbvLoss}</span>}
                </div>
            </div>
        </div>);
};

export default React.memo(IncidentDetails);
