import React from 'react';
import {Link} from 'react-router-dom';
import './styles.less';

const AvailabilityHome = ({links, onClick}) => {
    return (
        <div className="availability-buttons-container">
            <h1 className="availability-title">{'Availability Dashboards'}</h1>
            {links.map((item, idx) => (
                <Link
                    to={`/availability?dashboard=${item.id}`}
                    key={`sidebarLink${idx}`}
                    onClick={onClick}
                    className="dashboard-button"
                >
                    {item.label}
                </Link>))}
        </div>
    );
};

export default AvailabilityHome;
