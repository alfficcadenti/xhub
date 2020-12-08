import React from 'react';
import Iframe from 'react-iframe';
import './styles.less';


const OutageReport = () => {
    return (
        <div className="outage-report-container">
            <h1 className="page-title">{'Outage Report'}</h1>
            <div className="outage-report">
                <Iframe
                    url="https://tableau.sea.corp.expecn.com/views/OutageScorecard/OutageScorecard?:embed=y&:showVizHome=no&:host_url=https%3A%2F%2Ftableau.sea.corp.expecn.com%2F&:embed_code_version=3&:tabs=yes&:toolbar=yes&:showAppBanner=false&:display_spinner=no&:loadOrderID=0"
                    key={'iframe'}
                    width="1600px"
                    height="950px"
                    id={'outage-report'}
                    className="iframe"
                    position="relative"
                />
            </div>
        </div>
    );
};

export default OutageReport;
