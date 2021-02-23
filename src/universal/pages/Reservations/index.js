import React from 'react';
import {withRouter} from 'react-router-dom';
import Iframe from 'react-iframe';
import './styles.less';


const Reservations = () => {
    return (
        <div className="reservations-container">
            <h1 className="page-title">{'Reservations'}</h1>
            <div className="reservations">
                <Iframe
                    url="https://opexhub-grafana.expedia.biz/d/5pQ0gFPMk/realtime-metrics-v2? orgId=1&var-LOCALE=All&var-MARKETINGCHANNEL=All&var-PLATFORM=All&var-POS=All&var-IsKES=All"
                    key={'iframe'}
                    width="1600px"
                    height="950px"
                    id={'reservations'}
                    className="iframe"
                    position="relative"
                />
            </div>
        </div>
    );
};

export default withRouter(Reservations);
