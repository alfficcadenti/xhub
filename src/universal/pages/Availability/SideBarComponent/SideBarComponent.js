import React from 'react';
import {Link} from 'react-router-dom';
import {Divider} from '@homeaway/react-collapse';


const SideBarComponent = ({links, onClick}) => {
    const mainDashboardsSet = [...new Set(links.map((item) => item.main))];
    const mainDashboards = Array.from(mainDashboardsSet[0]);
    return (
        <div id="sidebar">
            {mainDashboards.map((mainCategory, idx) => (
                <Divider heading={mainCategory} id={`divider-${idx}`} key={idx} expanded >
                    {links.filter((link) => link.main === mainCategory).map((link, index) => (
                        <div><Link
                            to={`/availability?dashboard=${link.id}`}
                            key={`sidebarLink${index}`}
                            onClick={onClick}
                        >
                            {link.label}
                        </Link>
                        <span>{link.state}</span>
                        </div>
                    ))}
                </Divider>
            ))}
        </div>
    );
};

export default SideBarComponent;
