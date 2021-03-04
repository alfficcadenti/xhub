import React from 'react';
import './styles.less';
import moment from 'moment';


const ResetButton = ({start, end, resetGraphToDefault}) => {
    return (
        <button
            type="button"
            disabled={moment(end).diff(moment(start), 'hour') === 6}
            className={'btn btn-default reset-btn'}
            onClick={() => resetGraphToDefault()}
        >
            {'Set to last 6 hours'}
        </button>
    );
};

export default ResetButton;
