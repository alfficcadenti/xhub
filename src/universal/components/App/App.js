import React, {Fragment} from 'react';
import {Route, Switch} from 'react-router-dom';
import PropTypes from 'prop-types';
import Header from '../Header/Header';
import Home from '../../pages/Home';
import IncidentTrendsDashboard from '../../pages/IncidentTrendsDashboard';
import ResiliencyQuestionnaire from '../../pages/ResiliencyQuestionnaire';
import PSR from '../../pages/PSR';
import Availability from '../../pages/Availability';

function App() {
    return (
        <Fragment>
            <Header />
            <div className="main-container">
                <Switch>
                    <Route path="/home" render={() => <Home />}/>
                    <Route path="/incident-trends" render={() => <IncidentTrendsDashboard/>}/>
                    <Route path="/resiliency-questionnaire" render={() => <ResiliencyQuestionnaire />}/>
                    <Route path="/psr" render={() => <PSR />}/>
                    <Route path="/availability" render={() => <Availability />}/>
                </Switch>
            </div>
        </Fragment>
    );
}

App.propTypes = {
    location: PropTypes.string
};

export default App;