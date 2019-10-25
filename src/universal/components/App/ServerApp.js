import React from 'react';
import {StaticRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import App from "./App";

function ServerApp(props) {
    return (
        <StaticRouter location={props.path} context={{}}>
            <App value={props.value} list={props.list}/>
        </StaticRouter>
    );
}
ServerApp.propTypes = {
    path: PropTypes.string,
    value: PropTypes.string,
    list: PropTypes.array
};
export default ServerApp