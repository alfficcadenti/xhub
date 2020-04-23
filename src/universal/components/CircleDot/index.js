/* eslint-disable no-use-before-define */
import React from 'react';
import {SVGIcon} from '@homeaway/react-svg';
import {CHECK__12, CLOSE__12} from '@homeaway/svg-defs';
import './styles.less';


const CircleDot = ({isSuccess = true}) => {
    return (
        <div className={`circle-dot ${isSuccess ? 'success' : 'fail'}`}>
            <SVGIcon markup={isSuccess ? CHECK__12 : CLOSE__12} />
        </div>
    );
};

export default CircleDot;
