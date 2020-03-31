import React from 'react';
import Iframe from 'react-iframe';
import './styles.less';

const renderSplunkInfo = (urls) => (
    <div className="instructions">
        <h4>{'Splunk instructions'}</h4>
        <ol>
            <li>{'Remote desktop to'} <a href={'https://chajump.expeso.com'} target="_blank">{'chajump.expeso.com'}</a></li>
            <li>{'Logon with an expeso domain account'}</li>
            <li>{'Once logged into Remote Desktop. Open Browser and use below Splunk Link.'}</li>
            <a href={urls[0]} target="_blank">{urls[0]}</a>
        </ol>
    </div>
);

const renderCatchpointInfo = (urls) => (
    <div className="instructions">
        <h4>{'Catchpoint instructions'}</h4>
        <ol>
            <li>{'Go to'} <a href={'https://portal.catchpoint.com'} target="_blank">{'https://portal.catchpoint.com'}</a></li>
            <li>{'Enter "BEX" for Company Credentials (SSO) and click Login'}</li>
            <li>{'Enter your SEA credentials and click "Sign in"'}</li>
            <li>{'Dashboard\'s 20 thru 25 will provide the Site Availability for Last 7 days.'}</li>
            <a href={urls[0]} target="_blank">{urls[0]}</a>
        </ol>
    </div>
);

const renderIframes = (urls) => (
    <div id="iframes">
        {
            urls.map((url, idx) => (
                <Iframe url={url}
                    key={`iframe${idx}`}
                    width="100%"
                    height="800px"
                    id={`iframe${idx}`}
                    className="iframe"
                    position="relative"
                />))
        }
    </div>
);

const renderContent = (monitoring, urls) => {
    if (monitoring === 'Splunk') {
        return renderSplunkInfo(urls);
    }
    if (monitoring === 'Catchpoint') {
        return renderCatchpointInfo(urls);
    }
    return renderIframes(urls);
};

const DashboardWrapper = ({label, frequency, threshold, urls = [], monitoring}) => {
    return (<div id="dashboard-wrapper-component">
        <h1>{label}</h1>
        <div id="dashboard-wrapper-content">
            <div id="dashboard-wrapper-details">
                <div><b>{'Frequency:'}</b> {frequency}</div>
                <div><b>{'Threshold:'}</b> {threshold}</div>
                <span />
            </div>
            {renderContent(monitoring, urls)}
        </div>
    </div>
    );
};

export default DashboardWrapper;
