export const getData = (items) => {
    const BLANK = '---';
    return items.map((data = {}) => ({
        ID: data.id === null ? BLANK : data.id,
        PRB: data.prbId === null ? BLANK : data.prbId,
        'Channel ID': data.channelId === null ? BLANK : data.channelId,
        Email: data.emailAddress === null ? BLANK : data.emailAddress,
        'Robbie Reminder': data.robbieReminder === null ? BLANK : data.robbieReminder,
        Message: data.message === null ? BLANK : data.message,
        Notified: data.notifiedDate === null ? BLANK : data.notifiedDate,
        Status: data.status === null ? BLANK : data.status,
        Assignee: data.assignee === null ? BLANK : data.assignee
    }));
};
