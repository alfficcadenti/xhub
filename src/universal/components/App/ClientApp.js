import React from 'react';
import {BrowserRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import {hot} from 'react-hot-loader';
import App from "./App";

function ClientApp(props) {
    return (
        <BrowserRouter location={props.path} context={{}}>
            <App value={props.value} list={props.list}/>
        </BrowserRouter>
    );
}
ClientApp.propTypes = {
    value: PropTypes.string,
    list: PropTypes.array,
    path: PropTypes.string
};
export default hot(module)(ClientApp);