import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import './SiteMenu.less';

class SiteMenu extends Component {
    state = {
        dashboardsList: [
            {
                link: '/incident-trends',
                text: 'Incident Trends'
            },
            {
                link: '/resiliency-questionnaire',
                text: 'Resiliency Questionnaire'
            },
            {
                link: '/psr',
                text: 'Purchase Success Rate'
            }
        ]
    }

    renderLink = (dashboard) => (
        <li key={dashboard.text}>
            <Link to={dashboard.link} key={dashboard.text}>{dashboard.text}</Link>
        </li>
    );

    render() {
        return (
                <ul className="dashboard-list">
                    {this.state.dashboardsList.map((dashboard) => this.renderLink(dashboard))}
                </ul>
            
        );
    }
}

export default SiteMenu;