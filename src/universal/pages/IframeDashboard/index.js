import React from 'react';
import {useLocation, withRouter} from 'react-router-dom';
import Iframe from 'react-iframe';
import {PATH_TO_IFRAME_MAP} from './constants';
import './styles.less';


const IframeDashboard = () => {
    const {pathname} = useLocation();
    const {title, url} = PATH_TO_IFRAME_MAP[pathname] || {title: 'Dashboard Not Found', url: ''};
    return (
        <div className="iframe-dashboard-container">
            <h1 className="page-title">{title}</h1>
            <div>
                <Iframe
                    url={url}
                    key="iframe"
                    width="1600px"
                    height="970px"
                    id={pathname}
                    className="iframe"
                    position="relative"
                />
            </div>
        </div>
    );
};

export default withRouter(IframeDashboard);