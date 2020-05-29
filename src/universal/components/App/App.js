import React, {Fragment, useState} from 'react';
import {withRouter} from 'react-router';
import {Route, Switch} from 'react-router-dom';
import PropTypes from 'prop-types';
import Header from '../Header';
import Feedback from '../Feedback';
import LandingPage from '../../pages/LandingPage';
import Home from '../../pages/Home';
import pages from '../../pages';
import {EG_BRAND, BRANDS} from './constants';

function renderRoute(p, selectedBrands) {
    const Page = withRouter(p.component.default);
    return <Route key={p.link} path={p.link} render={() => <Page selectedBrands={selectedBrands} />} />;
}

function App() {
    let storedBrands;
    try {
        storedBrands = localStorage.getItem('selectedBrands');
        storedBrands = storedBrands
            ? storedBrands.split(',')
            : [EG_BRAND];
    } catch {
        storedBrands = [EG_BRAND];
    }
    const [selectedBrands, setSelectedBrands] = useState(storedBrands);
    return (
        <Fragment>
            <Header selectedBrands={selectedBrands} setSelectedBrands={setSelectedBrands} brands={BRANDS}/>
            <Feedback />
            <div className="main-container">
                <Switch>
                    <Route path="/landing-page" render={() => <LandingPage selectedBrands={selectedBrands}/>}/>
                    <Route path="/home" render={() => <Home />}/>
                    {pages.map((p) => renderRoute(p, selectedBrands))}
                </Switch>
            </div>
        </Fragment>
    );
}

App.propTypes = {
    location: PropTypes.string
};

export default App;