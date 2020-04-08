import React, {Fragment, useState} from 'react';
import {withRouter} from 'react-router';
import {Route, Switch} from 'react-router-dom';
import PropTypes from 'prop-types';
import Header from '../Header/Header';
import Home from '../../pages/Home';
import pages from '../../pages';
import FeedbackModal from '../Feedback';
import {ButtonOverlay} from '@homeaway/react-buttons';

function renderRoute(p) {
    const Page = withRouter(p.component.default);
    return <Route key={p.link} path={p.link} render={() => <Page />} />;
}

function App() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <Fragment>
            <Header />
            <div className="main-container">
                <Switch>
                    <Route path="/home" render={() => <Home />}/>
                    {pages.map(renderRoute)}
                </Switch>
            </div>
            <ButtonOverlay
                label="Feedback"
                size="xs"
                onClick={() => setIsModalOpen(true)}
                style={{position: 'absolute', zIndex: 1, top: '18%', right: '4%'}}
            />
            <FeedbackModal isOpen={isModalOpen} handleClose={() => setIsModalOpen(false)}/>
        </Fragment>
    );
}

App.propTypes = {
    location: PropTypes.string
};

export default App;