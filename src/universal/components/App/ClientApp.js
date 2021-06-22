import React from 'react';
import {BrowserRouter} from 'react-router-dom';
import {hot} from 'react-hot-loader';
import App from './App';
import ScrollToTop from './ScrollToTop';

import analyticsDataLayer from '../../../server/utils/analyticsDataLayer';
<<<<<<< HEAD
=======
import * as edapPkg from '@homeaway/edap-integrations/package.json';

>>>>>>> c2cd2c57e1253423e86eb3f95d30d6185274c6dc
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
