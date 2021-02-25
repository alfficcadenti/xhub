import React from 'react';
import {withRouter} from 'react-router-dom';
import Iframe from 'react-iframe';
import './styles.less';


const OperationalTV = () => {
    return (
        <div className="operational-tv-container">
            <h1 className="page-title">{'Operational TV'}</h1>
            <div className="operational-tv">
                <Iframe
                    url="https://opexhub-grafana.expedia.biz/d/dlJmetPMk/cortina-tv?orgId=1&refresh=30s&var-LOCALE=All&var-MARKETINGCHANNEL=All&var-PLATFORM=All&var-POS=All&var-IsKES=All"
                    key={'iframe'}
                    width="1600px"
                    height="950px"
                    id={'operational-tv'}
                    className="iframe"
                    position="relative"
                />
            </div>
        </div>
    );
};

export default withRouter(OperationalTV);
