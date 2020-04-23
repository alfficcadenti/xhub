/* eslint-disable no-use-before-define */
import React from 'react';
import {SVGIcon} from '@homeaway/react-svg';
import {CHECK__12, CLOSE__12, ALERT_WARNING__16} from '@homeaway/svg-defs';
import './styles.less';


const CircleDot = ({status}) => {
    const renderIcon = (subSystemStatus) => {
        switch (subSystemStatus) {
            case 'success':
                return CHECK__12;
            case 'warning':
                return ALERT_WARNING__16;
            case 'failed':
                return CLOSE__12;
            default:
                return CHECK__12;
        }
    };

    return (
        <div className={`circle-dot ${status}`}>
            <SVGIcon markup={renderIcon(status)} />
        </div>
    );
};

export default CircleDot;
