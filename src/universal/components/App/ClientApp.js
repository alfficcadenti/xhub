import React from 'react';
import {BrowserRouter} from 'react-router-dom';
import {hot} from 'react-hot-loader';
import App from './App';
import ScrollToTop from './ScrollToTop';

function ClientApp() {
    return (
        <BrowserRouter context={{}}>
            <ScrollToTop>
                <App />
            </ScrollToTop>
        </BrowserRouter>
    );
}

export default hot(module)(ClientApp);