import React, {useState, useEffect} from 'react';
import DashboardWrapper from './DashboardWrapper/DashboardWrapper';
import SideBarComponent from './SideBarComponent/SideBarComponent';
import {links} from './links';
import './styles.less';

const Availability = () => {
    const [currentDashboard, setCurrentDashboard] = useState();
    const [linkChanged, setLinkChanged] = useState(false);
    const [linksState, setLinksState] = useState(links);

    const checkStatus = () =>
        fetch('/grafana/alerts')
            .then((data) => data.json())
            .then((data) => {
                const updatedLinks = links.map((link) => {
                    const result = data.find((alertState) => alertState.name === link.label);
                    return (result && result.state)
                        ? {...link, state: result.state}
                        : link;
                });
                setLinksState(updatedLinks);
            });

    useEffect(() => {
        checkStatus();
        const interval = setInterval(() => {
            checkStatus();
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const setDashboardValue = () => {
            const query = new URLSearchParams(window.location.search);
            setCurrentDashboard(query.get('dashboard'));
        };

        if (linkChanged) {
            setDashboardValue();
        }

        return () => {
            setLinkChanged(false);
        };
    }, [linkChanged]);

    const getDashboardIndex = (id) => {
        const index = links.map((l) => l.id).indexOf(id);
        return index < 0 ? 0 : index;
    };

    const currentDashboardDetail = links[getDashboardIndex(currentDashboard)];

    return (
        <div className="availability-container">
            <nav className="availability-nav-bar">
                <SideBarComponent links={linksState} onClick={() => setLinkChanged(true)} />
            </nav>
            <section className="availability-section">
                <DashboardWrapper
                    urls={currentDashboardDetail.urls}
                    frequency={currentDashboardDetail.frequency}
                    threshold={currentDashboardDetail.threshold}
                    label={currentDashboardDetail.label}
                    monitoring={currentDashboardDetail.monitoring}
                    renderLink={currentDashboardDetail.renderLink}
                    dashboardLink={currentDashboardDetail.dashboardLink}
                />
            </section>
        </div>
    );
};

export default Availability;
