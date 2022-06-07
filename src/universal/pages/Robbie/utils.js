import React from 'react';

const BLANK = '---';

export const formatValue = (data, prop) => data[prop] === null ? BLANK : data[prop];

export const mapNotification = (notification) => ({
    ID: formatValue(notification, 'id'),
    PRB: notification.prbId === null ? BLANK : (
        <a href={`https://jira.expedia.biz/browse/${notification.prbId}`} target="_blank" rel="noopener noreferrer">{notification.prbId}</a>
    ),
    'Channel ID': formatValue(notification, 'channelId'),
    Email: formatValue(notification, 'emailAddress'),
    'Robbie Reminder': formatValue(notification, 'robbieReminder'),
    Message: formatValue(notification, 'message'),
    Notified: formatValue(notification, 'notifiedDate'),
    Status: formatValue(notification, 'status'),
    Assignee: formatValue(notification, 'assignee')
});
