
export const getIframeObject = (title, url) => ({title, url});

export const PATH_TO_IFRAME_MAP = {
    '/mttd-and-mttr-report': getIframeObject(
        'MTTD and MTTR Report',
        'https://tableau.sea.corp.expecn.com/views/MTTDandMTTROKRTrending/MTTDandMTTROKRTrending?:embed=y&:showVizHome=no&:host_url=https%3A%2F%2Ftableau.sea.corp.expecn.com%2F&:embed_code_version=3&:tabs=yes&:toolbar=yes&:showAppBanner=false&:display_spinner=no&:loadOrderID=0'
    ),
    '/outage-report': getIframeObject(
        'Outage Report',
        'https://tableau.sea.corp.expecn.com/views/WeeklyOutageReport_16061474527600/OrderandRevLossTrend?:embed=y&:showVizHome=no&:host_url=https%3A%2F%2Ftableau.sea.corp.expecn.com%2F&:embed_code_version=3&:tabs=yes&:toolbar=yes&:showAppBanner=false&:display_spinner=no&:loadOrderID=0'
    ),
    '/incident-driven-availability': getIframeObject(
        'Incident Driven Availability',
        'https://tableau.sea.corp.expecn.com/views/MTTDandMTTROKRTrending/Availability?:embed=y&:showVizHome=no&:host_url=https%3A%2F%2Ftableau.sea.corp.expecn.com%2F&:embed_code_version=3&:tabs=yes&:toolbar=yes&:showAppBanner=false&:display_spinner=no&:loadOrderID=0'
    )
};
