import React, {Fragment} from 'react';
import {Route, Switch} from 'react-router-dom';
import PropTypes from 'prop-types';
import Header from '../Header/Header';
import IncidentTrendsDashboard from '../../pages/IncidentTrendsDashboard';
import ResiliencyQuestionnaire from '../../pages/ResiliencyQuestionnaire';
import PSR from '../../pages/PSR';

function App() {
    return (
        <Fragment>
            <Header />
            <div className="main-container">
                <Switch>
                    <Route path="/incident-trends" render={() => <IncidentTrendsDashboard />}/>
                    <Route path="/resiliency-questionnaire" render={() => <ResiliencyQuestionnaire />}/>
                    <Route path="/psr" render={() => <PSR />}/>
                </Switch>
            </div>
        </Fragment>
    );
}

App.propTypes = {
    path: PropTypes.string
};

export default App;