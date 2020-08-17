export const getPropValue = (item, prop) => item[prop] || '-';

export const formatTickets = (tickets) => Object.entries(tickets.portfolioTickets || {})
    .reduce((acc, [portfolio, portfolioTickets]) => acc.concat(
        Object.values(portfolioTickets).map((defect) => ({
            Portfolio: portfolio,
            Key: getPropValue(defect, 'defectNumber'),
            Summary: getPropValue(defect, 'summary'),
            Priority: getPropValue(defect, 'priority'),
            Status: getPropValue(defect, 'status'),
            Resolution: getPropValue(defect, 'resolution'),
            Opened: getPropValue(defect, 'openDate')
        }))
    ), []);

export const formatBarChartData = (data) => Object.entries(data)
    .map(([date, {totalTickets, ticketIds}]) => {
        return {date, counts: totalTickets, tickets: ticketIds};
    }, []);

// eslint-disable-next-line complexity
export const getSelectedBarTickets = (selectedBar) => {
    if (selectedBar && selectedBar.activePayload && selectedBar.activePayload[0] && selectedBar.activePayload[0].payload && selectedBar.activePayload[0].payload.tickets) {
        return selectedBar.activePayload[0].payload.tickets;
    }
    return [];
};

export const getPanelDataUrl = (portfolios, panel, brand) => {
    // const baseUrl = 'https://opxhub-data-service.us-west-2.test.expedia.com/v1/portfolio';
    const baseUrl = '/v1/portfolio';
    const portfoliosQuery = `?portfolios=${portfolios.map((p) => p.value).join('&portfolios=')}`;
    if (!panel) {
        return `${baseUrl}${portfoliosQuery}`;
    }
    return `${baseUrl}/panel/${panel}${portfoliosQuery}&brand=${brand}`;
};
