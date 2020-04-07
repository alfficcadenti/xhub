import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import pages from '../../pages';
import './SiteMenu.less';

class SiteMenu extends Component {
    renderLink = (dashboard) => (
        <li key={dashboard.text}>
            <Link to={dashboard.link} key={dashboard.text}>{dashboard.text}</Link>
        </li>
    );

    render() {
        return (
            <ul className="dashboard-list">
                {pages.map((dashboard) => this.renderLink(dashboard))}
            </ul>

        );
    }
}

export default SiteMenu;