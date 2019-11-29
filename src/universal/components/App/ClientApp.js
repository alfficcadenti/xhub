import React from 'react';
import {BrowserRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import {hot} from 'react-hot-loader';
import App from "./App";

function ClientApp(props) {
    return (
        <BrowserRouter context={{}}>
            <App value={props.value} list={props.list} />
        </BrowserRouter>
    );
}
ClientApp.propTypes = {
    value: PropTypes.string,
    list: PropTypes.array,
};
export default hot(module)(ClientApp);