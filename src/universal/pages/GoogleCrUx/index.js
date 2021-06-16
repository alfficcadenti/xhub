import React from 'react';
import {withRouter} from 'react-router-dom';
import Iframe from 'react-iframe';
import './styles.less';


const GoogleCrUx = () => {
    return (
        <div className="google-crux-container">
            <h1 className="page-title">{'Google CrUx (RUM)'}</h1>
            <div className="google-crux">
                <Iframe
                    url="https://grafana.test.expedia.com/d/d0wMYdVZV/egperf_crux?theme=light&kiosk=tv&var-site=vrbo.com&var-scenario=Origin&var-formFactor=PHONE"
                    key="iframe"
                    width="1600px"
                    height="950px"
                    id="google-crux"
                    className="iframe"
                    position="relative"
                />
            </div>
        </div>
    );
};

export default withRouter(GoogleCrUx);
