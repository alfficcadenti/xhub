import React from 'react';
import {Link} from 'react-router-dom';
import CircleDot from '../../../components/CircleDot';
import Collapsible from './Collapsible';

const renderDashboardLink = (link, onClick) => (
    <div className="sidebar-item" key={`sidebar-div${link.id}`}>
        <span className="sidebar-item-status" key={`sidebar-item-${link.id}`}>
            {link.state && <CircleDot status={link.state === 'ok' ? 'success' : 'failed'}/>}
        </span>
        <Link
            to={`/availability?dashboard=${link.id}`}
            key={`sidebar-link${link.id}`}
            onClick={onClick}
        >
            {link.label}
        </Link>
    </div>
);

const headerElement = (header, id, links, onClick, status) => (
    <Collapsible title={header} status={status} key={`header-${id}`}>
        {links.map((link) => (
            renderDashboardLink(link, onClick)
        ))}
    </Collapsible>
);

const getLinks = (mainCategory, links) => (links.filter((link) => link.main === mainCategory));

const getMainCategoryStatus = (links = []) => {
    if (links.find((elem) => elem.state && elem.state === 'alerting')) {
        return 'failed';
    }
    if (links.find((elem) => elem.state && elem.state === 'ok')) {
        return 'success';
    }
    return '';
};

const renderElements = (mainDashboards, links, onClick) => (
    mainDashboards.map((mainCategory, idx) => {
        const itemLinks = getLinks(mainCategory, links);
        return headerElement(mainCategory, idx, itemLinks, onClick, getMainCategoryStatus(itemLinks));
    })
);

const SideBarComponent = ({links, onClick}) => {
    const mainDashboardsSet = [...new Set(links.map((item) => item.main))];
    const mainDashboards = Array.from(mainDashboardsSet[0]);
    const mainElements = renderElements(mainDashboards, links, onClick);
    return (
        <nav className="availability-nav-bar">
            {mainElements}
        </nav>
    );
};

export default SideBarComponent;