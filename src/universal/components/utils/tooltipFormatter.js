const formatToUSDollarCurrency = (number) => number.
    toLocaleString('en-US', {style: 'currency', currency: 'USD'});

export const financialImpactTooltipFormatter = (tooltipData, {name, seriesName}) => {
    const incidents = tooltipData[name][seriesName];
    const incidentsString = incidents.map((item) => {
        return `<div class="incident-wrapper">
                        <span class="incident-number">${item.incidentNumberLink}</span>
                        <span class="incident-financial-impact">${formatToUSDollarCurrency(item.lostRevenue)}</span>
                        </div>`;
    }).join('');

    return `<div class="financial-impact-tooltip">
        <p class="brand-name">${seriesName}</p>
        ${incidentsString}
    </div>`;
};
