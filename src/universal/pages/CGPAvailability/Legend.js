import React from 'react';
import {THRESHOLDS} from './constants.js';

const Legend = () =>
    (<div id="legendContainer">
        <div className="negative">{`< ${THRESHOLDS.medium}`}</div>
        <div className="attention">{`>= ${THRESHOLDS.medium}`}</div>
        <div className="positive">{`>= ${THRESHOLDS.high}`}</div>
    </div>);

export default Legend;

