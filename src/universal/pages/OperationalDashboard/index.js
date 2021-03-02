import React from 'react';
import {withRouter} from 'react-router-dom';
import Iframe from 'react-iframe';
import './styles.less';


const OperationalDashboard = () => {
    return (
        <div className="operational-dashboard-container">
            <h1 className="page-title">{'Operational Dashboard'}</h1>
            <div className="operational-dashboard">
                <Iframe
                    url="https://opexhub-grafana.expedia.biz/d/LNYFUKEGz/cortina?orgId=1&refresh=30s&var-LOCALE=All&var-MARKETINGCHANNEL=All&var-PLATFORM=All&var-POS=All&var-IsKES=All"
                    key={'iframe'}
                    width="1600px"
                    height="950px"
                    id="operational-dashboard"
                    className="iframe"
                    position="relative"
                />
            </div>
        </div>
    );
};

export default withRouter(OperationalDashboard);
