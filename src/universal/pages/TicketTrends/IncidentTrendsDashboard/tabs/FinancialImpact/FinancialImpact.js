import React from 'react';
import NoResults from '../../../../../components/NoResults';
import {buildFinancialImpactData} from '../../../incidentsHelper';
import LineChartWrapper from '../../../../../components/LineChartWrapper';
import TooltipContent from './TooltipContent';
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
                                renderTooltipContent={TooltipContent}
                            />
                            <LineChartWrapper
                                title="Gross Booking Value Loss"
                                data={grossData}
                                keys={grossKeys}
                                tooltipData={grossTooltipData}
                                renderTooltipContent={TooltipContent}
                            />
                        </>
                    )
            }
        </div>
    );
};

export default React.memo(FinancialImpact);
