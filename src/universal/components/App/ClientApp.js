import React from 'react';
import {BrowserRouter} from 'react-router-dom';
import {hot} from 'react-hot-loader';
import App from './App';

function ClientApp() {
    return (
        <BrowserRouter context={{}}>
            <App />
        </BrowserRouter>
    );
}

export default hot(module)(ClientApp);