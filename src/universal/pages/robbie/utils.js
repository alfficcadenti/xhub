import React from 'react';

export const getData = (items) => {
    const BLANK = '---';
    const formatValue = (data, prop) => data[prop] === null ? BLANK : data[prop];
    return items.map((data = {}) => ({
        ID: formatValue(data, 'id'),
        PRB: data.prbId === null ? BLANK : (
            <a href={`https://jira.expedia.biz/browse/${data.prbId}`} target="_blank">{data.prbId}</a>
        ),
        'Channel ID': formatValue(data, 'channelId'),
        Email: formatValue(data, 'emailAddress'),
        'Robbie Reminder': formatValue(data, 'robbieReminder'),
        Message: formatValue(data, 'message'),
        Notified: formatValue(data, 'notifiedDate'),
        Status: formatValue(data, 'status'),
        Assignee: formatValue(data, 'assignee')
    }));
};
