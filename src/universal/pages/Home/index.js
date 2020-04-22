import React from 'react';
import {Link} from 'react-router-dom';
import {Alert} from '@homeaway/react-alerts';
import dashboardsList from '../index';
import './styles.less';

const Home = () => {
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
        <div className="home-buttons-container">
            {dashboardsList.map(renderButton)}
            <Alert
                className="covid-message"
                title="COVID-19 Updates"
                type="danger"
                msg={covidLink()}
                dismissible
            />
        </div>
    );
};

export default Home;
