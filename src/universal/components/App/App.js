import React, {Fragment} from 'react';
import {Route} from 'react-router-dom';
import PropTypes from 'prop-types';
import Header from "../Header/Header";
import Welcome from "../Welcome/Welcome";
import IncidentTrendsDashboard from '../../pages/IncidentTrendsDashboard';

function App(props) {
    return (
        <Fragment>
            <Header />
            <div className="main-container">
                <Route path="/welcome/1" render={() => <Welcome value={props.value} list={props.list} />}/>
                <Route path="/incident-trends" render={() => <IncidentTrendsDashboard value={props.value} list={props.list} />}/>
            </div>
        </Fragment>
    );
}

App.propTypes = {
    value: PropTypes.string,
    list: PropTypes.array
};

export default App