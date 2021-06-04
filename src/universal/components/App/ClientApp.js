import React from 'react';
import {BrowserRouter} from 'react-router-dom';
import {hot} from 'react-hot-loader';
import App from './App';
import ScrollToTop from './ScrollToTop';
import analyticsDataLayer from '../../../server/utils/analyticsDataLayer';

function ClientApp() {
    localStorage.setItem('isBrandFilterChanged', JSON.stringify(false));
    localStorage.setItem('isQueryChanged', JSON.stringify(false));

    window.analyticsdatalayer = analyticsDataLayer;
    window.edapOptions = {
        skipPageview: true,
        skipFlush: true,
        skipGA: true
    };
    window.edap = window.edap || [];

    return (
        <BrowserRouter context={{}}>
            <ScrollToTop>
                <App />
            </ScrollToTop>
        </BrowserRouter>
    );
}

export default hot(module)(ClientApp);