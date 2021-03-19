import React from 'react';
import './styles.less';


const ResetButton = ({isDisabled, resetGraphToDefault}) => {
    return (
        <button
            type="button"
            disabled={isDisabled}
            className={'btn btn-default reset-btn'}
            onClick={() => resetGraphToDefault()}
        >
            {'Set to last 6 hours'}
        </button>
    );
};

export default ResetButton;
