import React, {Fragment, useState} from 'react';
import {withRouter} from 'react-router';
import {Route, Switch} from 'react-router-dom';
import PropTypes from 'prop-types';
import Header from '../Header';
import Feedback from '../Feedback';
import LandingPage from '../../pages/LandingPage';
import Home from '../../pages/Home';
import pages from '../../pages';

const BRANDS = [
    'Expedia Group',
    'BEX',
    'Hotels.com',
    'Vrbo'
];

function renderRoute(p) {
    const Page = withRouter(p.component.default);
    return <Route key={p.link} path={p.link} render={() => <Page />} />;
}

function App() {
    let brand;
    try {
        brand = localStorage.getItem('selectedBrand') || BRANDS[0];
    } catch {
        brand = BRANDS[0];
    }
    const [selectedAppBrand, setSelectedAppBrand] = useState(brand);

    return (
        <Fragment>
            <Header setSelectedAppBrand={setSelectedAppBrand} selectedAppBrand={selectedAppBrand} brands={BRANDS}/>
            <Feedback />
            <div className="main-container">
                <Switch>
                    <Route path="/landing-page" render={() => <LandingPage selectedBrand={selectedAppBrand}/>}/>
                    <Route path="/home" render={() => <Home />}/>
                    {pages.map(renderRoute)}
                </Switch>
            </div>
        </Fragment>
    );
}

App.propTypes = {
    location: PropTypes.string
};

export default App;