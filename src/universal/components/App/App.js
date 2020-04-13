import React, {Fragment} from 'react';
import {withRouter} from 'react-router';
import {Route, Switch} from 'react-router-dom';
import PropTypes from 'prop-types';
import Header from '../Header/Header';
import Home from '../../pages/Home';
import PRB from '../../pages/PRB';
import pages from '../../pages';

function renderRoute(p) {
    const Page = withRouter(p.component.default);
    return <Route key={p.link} path={p.link} render={() => <Page />} />;
}

function App() {
    return (
        <Fragment>
            <Header />
            <div className="main-container">
                <Switch>
                    <Route path="/home" render={() => <Home />}/>
                    {pages.map(renderRoute)}
                    {/* TODO: Remove following once pages/index.js has prb route */}
                    <Route path="/prb" render={() => <PRB />}/>
                </Switch>
            </div>
        </Fragment>
    );
}

App.propTypes = {
    location: PropTypes.string
};

export default App;