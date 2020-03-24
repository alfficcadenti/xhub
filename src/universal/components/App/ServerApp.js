import React from 'react';
import {StaticRouter} from 'react-router-dom';
import App from './App';

function ServerApp(location) {
    return (
        <StaticRouter location={location} context={{}}>
            <App location={location}/>
        </StaticRouter>
    );
}

export default ServerApp;