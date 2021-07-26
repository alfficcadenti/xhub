import {getData} from '../utils';
import {expect} from 'chai';


const BLANK = '---';

it('getData', () => {
    const row = [
        {
            id: '62d820cf-e6f1-48d5-be57-acbb3ef87970',
            prbId: 'PRB-1424',
            channelId: 'D01R1RC2MHA',
            emailAddress: 'brogers@expediagroup.com',
            robbieReminder: 'SECOND',
            message: 'Hello from Problem Management Team. This is a kind reminder to review and fill out required details in *PRB-1424*. The case has been open for *13* days.\n\n*Summary:* Vrbo HA_Connect database degraded due to large amount of updates from an inventory partner\n*Priority:* 1-Critical\n*Jira:* https://jira.expedia.biz/browse/PRB-1424\n\nNeed help? Contact us via <slack://channel?team=T09D77D4P&id=C01AG3JL2F8|#eg-problem-management>\n',
            notifiedDate: '2021-06-01T09:30:19.875989-05:00',
            status: true,
            assignee: 'OPX Team'
        }
    ];
    const data = row[0];
    expect(getData(row)[0]).to.eql({
        ID: data.id,
        PRB: 'PRB-1424',
        'Channel ID': data.channelId,
        Email: data.emailAddress,
        'Robbie Reminder': data.robbieReminder,
        Message: data.message,
        Notified: data.notifiedDate,
        Status: data.status,
        Assignee: 'OPX Team'
    });
});


it('getData - null values', () => {
    const row = [
        {
            id: null,
            prbId: null,
            channelId: null,
            emailAddress: null,
            robbieReminder: null,
            message: null,
            notifiedDate: null,
            status: null,
            assignee: null
        }
    ];
    expect(getData(row)[0]).to.eql({
        ID: BLANK,
        PRB: BLANK,
        'Channel ID': BLANK,
        Email: BLANK,
        'Robbie Reminder': BLANK,
        Message: BLANK,
        Notified: BLANK,
        Status: BLANK,
        Assignee: BLANK
    });
});
