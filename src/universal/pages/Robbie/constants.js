import React from 'react';
import moment from 'moment';

export const DEFAULT_FROM = moment().subtract(6, 'months');

export const DEFAULT_TO = moment();

export const COLUMNS = ['PRB', 'Email', 'Robbie Reminder', 'Message', 'Notified', 'Status'];

export const COLUMNS_INFO = {
    Status: (
        <div>
            {<div>
                <div>{'Status of Slack Reminder:'}</div>
                <div>{' True if successful else returns False'}</div>
            </div>}
        </div>
    ),
    'Robbie Reminder': (
        <div>
            {<ul>
                <li>{'First: 8 days open'}</li>
                <li>{'Second: 14 days open'}</li>
                <li>{'Third: 21 days open'}</li>
                <li>{'Manager: 28 days open'}</li>
            </ul>
            }
        </div>
    )
};
