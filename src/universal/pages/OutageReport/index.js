import React, {useState} from 'react';
import {RadioButton, RadioGroup} from '@homeaway/react-form-components';
import Iframe from 'react-iframe';
import './styles.less';

const weeklyReportUrl = 'WeeklyOutageScorecard_15843878097700';
const monthlyReportUrl = 'MonthlyOutageScorecard';


const OutageReport = () => {
    const [isWeekly, setIsWeekly] = useState(true);

    return (
        <div className="outage-report-container">
            <h1 className="page-title">{'Outage report'}</h1>
            <RadioGroup name="choice" ariaLabel="Outage report choices">
                <RadioButton
                    label="Weekly outage report"
                    value="monthly"
                    checked={isWeekly}
                    onChange={() => setIsWeekly(true)}
                />
                <RadioButton
                    label="Monthly outage report"
                    value="monthly"
                    checked={!isWeekly}
                    onChange={() => setIsWeekly(false)}
                />
            </RadioGroup>
            <div className="outage-report">
                <Iframe
                    url={`https://tableau.sea.corp.expecn.com/views/${isWeekly ? weeklyReportUrl : monthlyReportUrl}/Scorecard?:embed=y&:showVizHome=no&:host_url=https%3A%2F%2Ftableau.sea.corp.expecn.com%2F&:embed_code_version=3&:tabs=yes&:toolbar=yes&:showAppBanner=false&:display_spinner=no&:loadOrderID=0`}
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
