import React, {Fragment} from 'react';
import ChartWrapper from '../../../../../components/ChartWrapper';
import NoResults from '../../../../../components/NoResults/NoResults';
import {buildFinancialImpactData} from '../../../incidentsHelper';


const FinancialImpact = ({filteredIncidents}) => {
    const {
        tooltipData: tooltipRevenueLossData,
        series: revenueLossSeries,
        weekIntervals: revenueLossWeekIntervals
    } = buildFinancialImpactData(filteredIncidents, 'estimatedRevenueLoss');
    const {
        tooltipData: tooltipGrossLossData,
        series: revenueGrossSeries,
        weekIntervals: revenueGrossWeekIntervals
    } = buildFinancialImpactData(filteredIncidents, 'estimatedGrossLoss');

    return (<div className="financial-impact">
        {
            filteredIncidents && filteredIncidents.length ?
                <Fragment>
                    <ChartWrapper
                        tooltipData={tooltipRevenueLossData}
                        series={revenueLossSeries}
                        xAxisValues={revenueLossWeekIntervals}
                        title="Lost Revenues by Impacted Brand"
                    />
                    <ChartWrapper
                        tooltipData={tooltipGrossLossData}
                        series={revenueGrossSeries}
                        xAxisValues={revenueGrossWeekIntervals}
                        title="Gross Booking Value Loss"
                    />
                </Fragment> :
                <NoResults />
        }
    </div>);
};

export default React.memo(FinancialImpact);