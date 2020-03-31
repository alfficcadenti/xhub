import React, {Fragment} from 'react';
import {Link} from 'react-router-dom';
import {Alert} from '@homeaway/react-alerts';

import './styles.less';

const Home = () => {
    const dashboardsList = [
        {
            id: 'incident-trends',
            link: '/incident-trends',
            text: 'Incident Trends'
        },
        {
            id: 'psr',
            link: '/psr',
            text: 'Purchase Success Rate'
        },
        {
            id: 'resiliency-questionnaire',
            link: '/resiliency-questionnaire',
            text: 'Resiliency Questionnaire'
        },
        {
            id: 'availability',
            link: '/availability',
            text: 'Availability'
        }
    ];
    const renderButton = (item) => (
        <Link
            to={{pathname: item.link}}
            key={`link-${item.id}`}
            className="dashboard-button"
        >
            <span
                id={item.id}
                key={item.id}
            >
                {item.text}
            </span>
        </Link>
    );

    const covidLink = () => (
        <Link
            to={{pathname: '/incident-trends', search: '?covidFilter=true'}}
            key={'link-covid-incidents'}
        >
            {'Monitor the incidents related to the COVID-19'}
        </Link>
    );

    return (
        <Fragment>
            <div id="home-buttons-container">
                {dashboardsList.map((item) => renderButton(item))}
            </div>
            <Alert
                id="covid-message"
                title="COVID-19 Updates"
                type="danger"
                msg={covidLink()}
                dismissible
            />
        </Fragment>
    );
};

export default Home;
