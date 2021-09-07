import React from 'react';
import {expect} from 'chai';
import {mapNotification} from '../utils';

const BLANK = '---';

it('mapNotification', () => {
    const notification = {
        id: '62d820cf-e6f1-48d5-be57-acbb3ef87970',
        prbId: 'PRB-1424',
        channelId: 'D01R1RC2MHA',
        emailAddress: 'brogers@expediagroup.com',
        robbieReminder: 'SECOND',
        message: 'Hello from Problem Management Team. This is a kind reminder to review and fill out required details in *PRB-1424*. The case has been open for *13* days.\n\n*Summary:* Vrbo HA_Connect database degraded due to large amount of updates from an inventory partner\n*Priority:* 1-Critical\n*Jira:* https://jira.expedia.biz/browse/PRB-1424\n\nNeed help? Contact us via <slack://channel?team=T09D77D4P&id=C01AG3JL2F8|#eg-problem-management>\n',
        notifiedDate: '2021-06-01T09:30:19.875989-05:00',
        status: true,
        assignee: 'OPX Team'
    };
    expect(mapNotification(notification)).to.eql({
        ID: notification.id,
        PRB: <a href= "https://jira.expedia.biz/browse/PRB-1424" target="_blank">{notification.prbId}</a>,
        'Channel ID': notification.channelId,
        Email: notification.emailAddress,
        'Robbie Reminder': notification.robbieReminder,
        Message: notification.message,
        Notified: notification.notifiedDate,
        Status: notification.status,
        Assignee: 'OPX Team'
    });
});


it('getData - null values', () => {
    const notification = {
        id: null,
        prbId: null,
        channelId: null,
        emailAddress: null,
        robbieReminder: null,
        message: null,
        notifiedDate: null,
        status: null,
        assignee: null
    };
    expect(mapNotification(notification)).to.eql({
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
