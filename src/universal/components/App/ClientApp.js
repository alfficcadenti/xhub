import React from 'react';
import {BrowserRouter} from 'react-router-dom';
import {hot} from 'react-hot-loader';
import App from './App';
import ScrollToTop from './ScrollToTop';

import analyticsDataLayer from '../../../server/utils/analyticsDataLayer';
import * as edapPkg from '@homeaway/edap-integrations/package.json';

function ClientApp() {
    localStorage.setItem('isBrandFilterChanged', JSON.stringify(false));
    localStorage.setItem('isQueryChanged', JSON.stringify(false));

    window.analyticsdatalayer = analyticsDataLayer({name: 'vrbo'});
    window.edapOptions = {
        skipPageview: true,
        skipFlush: true,
        skipGA: true
    };
    window.edap = window.edap || [];

    const edapVersion = edapPkg.version;

    // Load EDAP
    const edapScript = document.createElement('script');
    edapScript.setAttribute('src', `//csvcus.homeaway.com/rsrcs/edap-integrations/${edapVersion}/javascripts/edap-integrations.min.js`);
    edapScript.setAttribute('async', '');
    document.head.appendChild(edapScript);

    return (
        <BrowserRouter context={{}}>
            <ScrollToTop>
                <App />
            </ScrollToTop>
        </BrowserRouter>
    );
}

export default hot(module)(ClientApp);
