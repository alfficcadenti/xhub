import React from 'react';
import Iframe from 'react-iframe';
import './styles.less';

const renderSplunkInfo = (urls) => (
    <div id="splunk-instructions">
        <h4>{"Splunk instruction's"}</h4>
        <ol>
            <li>{'remote desktop to'} <a href={'https://chajump.expeso.com'} target="_blank">{'chajump.expeso.com'}</a></li>
            <li>{'logon with an expeso domain account'}</li>
            <li>{'use DUO as 2FA'}</li>
            <li>{'open a browser'}</li>
            <li>{'navigate to splunk'}</li>
            <li>{'logon with expeso account (has to have access)'}</li>
            <a href={urls[0]} target="_blank">{'Link to Splunk Dashboard'}</a>
        </ol>

    </div>
);

const DashboardWrapper = ({label, frequency, threshold, urls, monitoring}) => {
    return (<div id="dashboard-wrapper-component">
        <h1>{label}</h1>
        <div id="dashboard-wrapper-content">
            <div id="dashboard-wrapper-details">
                <div><b>{'Frequency:'}</b> {frequency}</div>
                <div><b>{'Threshold:'}</b> {threshold}</div>
                <span />
            </div>
            {
                monitoring === 'Splunk' ? renderSplunkInfo(urls) :
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
            }
        </div>
    </div>
    );
};

export default DashboardWrapper;
