import React, {useState} from 'react';
import {RadioButton, RadioGroup} from '@homeaway/react-form-components';
import Iframe from 'react-iframe';
import './styles.less';

const weeklyReportUrl = 'https://tableau.sea.corp.expecn.com/#/redirect_to_view/138057';
const monthlyReportUrl = 'https://tableau.sea.corp.expecn.com/#/views/MonthlyOutageScorecard/Scorecard?:iid=1';

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
                <Iframe url={isWeekly ? weeklyReportUrl : monthlyReportUrl}
                    key={'iframe'}
                    width="100%"
                    height="800px"
                    id={'outage-report'}
                    className="iframe"
                    position="relative"
                />
            </div>
        </div>
    );
};

export default OutageReport;
