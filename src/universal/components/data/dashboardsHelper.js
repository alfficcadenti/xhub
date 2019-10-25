import dashboardData from './dashboardsData.json';

const getDashboard = (path) => {
    // eslint-disable-next-line no-console
    console.log(path)
    if (path) {
        const dashboardlists = Object.values(dashboardData);
        for (let i = 0; i < dashboardlists.length; i++) {
            const found = dashboardlists[i].dashboards.find((dashboard) => dashboard.path === path);
            if (found) {
                return found;
            }
        }
    }
    return {iframes: []};
};

const getRoutes = () => {
    let dashboards = [];
    Object.values(dashboardData).forEach((dashboardlist) => {
        dashboards = dashboards.concat(dashboardlist.dashboards);
    });
    return dashboards;
};

const getDashboardsList = (accessLevel) => {
    const dashboardsList = [];
    Object.keys(dashboardData).forEach((label) => {
        const links = [];
        const {info} = dashboardData[label];
        dashboardData[label].dashboards.forEach((dashboard) => {
            if (dashboard.accessLevel >= accessLevel) {
                links.push({
                    text: dashboard.title,
                    link: dashboard.path,
                    externalUrl: dashboard.externalUrl,
                    url: dashboard.url
                });
            }
        });
        if (links.length > 0) {
            dashboardsList.push({label, links, info});
        }
    });
    return dashboardsList;
};

export {
    getDashboard,
    getRoutes,
    getDashboardsList
};
