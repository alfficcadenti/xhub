import React from 'react';
import {withRouter} from 'react-router-dom';
import Iframe from 'react-iframe';
import './styles.less';


const MTTDAndMTTRReport = () => {
    return (
        <div className="mttd-and-mttr-report-container">
            <h1 className="page-title">{'MTTD and MTTR Report'}</h1>
            <div className="mttd-and-mttr-report">
                <Iframe
                    url="https://tableau.sea.corp.expecn.com/views/MTTDandMTTROKRTrending/MTTDandMTTROKRTrending?:embed=y&:showVizHome=no&:host_url=https%3A%2F%2Ftableau.sea.corp.expecn.com%2F&:embed_code_version=3&:tabs=yes&:toolbar=yes&:showAppBanner=false&:display_spinner=no&:loadOrderID=0"
                    key="iframe"
                    width="1600px"
                    height="970px"
                    id="mttd-and-mttr-report"
                    className="iframe"
                    position="relative"
                />
            </div>
        </div>
    );
};

export default withRouter(MTTDAndMTTRReport);