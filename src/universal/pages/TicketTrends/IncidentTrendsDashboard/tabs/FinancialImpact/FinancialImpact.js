import React from 'react';
import NoResults from '../../../../../components/NoResults';
import {buildFinancialImpactData} from '../../../incidentsHelper';
import LineChartWrapper from '../../../../../components/LineChartWrapper';
import './styles.less';

const FinancialImpact = ({startDate, endDate, tickets, brand}) => {
    const {
        data: revenueData,
        keys: revenueKeys,
        tooltipData: revenueTooltipData
    } = buildFinancialImpactData(tickets, startDate, endDate, brand, 'estimatedRevenueLoss');
    const {
        data: grossData,
        keys: grossKeys,
        tooltipData: grossTooltipData
    } = buildFinancialImpactData(tickets, startDate, endDate, brand, 'estimatedGrossLoss');

    const htmlDecode = (input) => {
        const doc = new DOMParser().parseFromString(input, 'text/html');
        return doc.documentElement.textContent;
    };

    const renderLinks = ({link, lostRevenue}) => (
        <div key={link} className="incident-wrapper">
            <div
                className="incident-number"
                dangerouslySetInnerHTML={{ //eslint-disable-line
                    __html: htmlDecode(link)
                }}
            />
            <div className="incident-financial-impact">
                {lostRevenue.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}
            </div>
        </div>
    );

    return (
        <div className="financial-impact">
            {
                !tickets || !tickets.length
                    ? <NoResults />
                    : (
                        <>
                            <LineChartWrapper
                                title="Booking Revenue Loss"
                                data={revenueData}
                                keys={revenueKeys}
                                tooltipData={revenueTooltipData}
                                renderTooltipContent={renderLinks}
                            />
                            <LineChartWrapper
                                title="Gross Booking Value Loss"
                                data={grossData}
                                keys={grossKeys}
                                tooltipData={grossTooltipData}
                                renderTooltipContent={renderLinks}
                            />
                        </>
                    )
            }
        </div>
    );
};

export default React.memo(FinancialImpact);
