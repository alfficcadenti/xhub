import React, {Fragment} from 'react';
import {Route, Switch} from 'react-router-dom';
import PropTypes from 'prop-types';
import Header from "../Header/Header";
import IncidentTrendsDashboard from '../../pages/IncidentTrendsDashboard';
import ResiliencyQuestionnaire from '../../pages/ResiliencyQuestionnaire';

function App(props) {
    return (
        <Fragment>
            <Header />
            <div className="main-container">
                <Switch>
                    <Route path="/incident-trends" render={() => <IncidentTrendsDashboard value={props.value} list={props.list} />}/>
                    <Route path="/resiliency-questionnaire" render={() => <ResiliencyQuestionnaire value={props.value} list={props.list} />}/>
                </Switch>
            </div>
        </Fragment>
    );
}

App.propTypes = {
    value: PropTypes.string,
    list: PropTypes.array,
    path: PropTypes.string
};

export default App