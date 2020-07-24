import React from 'react';
import NoResults from '../../../../../components/NoResults/NoResults';
import {buildFinancialImpactData} from '../../../incidentsHelper';
import LineChartWrapper from '../../../../../components/LineChartWrapper';
import './styles.less';

const FinancialImpact = ({filteredIncidents}) => {
    const {
        data: revenueData,
        brands: revenueBrands,
        tooltipData: revenueTooltipData
    } = buildFinancialImpactData(filteredIncidents, 'estimatedRevenueLoss');
    const {
        data: grossData,
        brands: grossBrands,
        tooltipData: grossTooltipData
    } = buildFinancialImpactData(filteredIncidents, 'estimatedGrossLoss');

    const htmlDecode = (input) => {
        const doc = new DOMParser().parseFromString(input, 'text/html');
        return doc.documentElement.textContent;
    };

    const renderLinks = ({incidentNumberLink, lostRevenue}) => (
        <div key={incidentNumberLink} className="incident-wrapper">
            <div
                className="incident-number"
                dangerouslySetInnerHTML={{ //eslint-disable-line
                    __html: htmlDecode(incidentNumberLink)
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
                !filteredIncidents || !filteredIncidents.length
                    ? <NoResults />
                    : (
                        <>
                            <LineChartWrapper
                                title="Booking Revenue Loss"
                                data={revenueData}
                                keys={revenueBrands}
                                tooltipData={revenueTooltipData}
                                renderTooltipContent={renderLinks}
                            />
                            <LineChartWrapper
                                title="Gross Booking Value Loss"
                                data={grossData}
                                keys={grossBrands}
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
