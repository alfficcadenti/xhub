import React from 'react';
import {StaticRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import App from './App';

function ServerApp(props) {
    return (
        <StaticRouter location={props.path} context={{}}>
            <App location={props.path}/>
        </StaticRouter>
    );
}
ServerApp.propTypes = {
    path: PropTypes.string,
};
export default ServerApp;