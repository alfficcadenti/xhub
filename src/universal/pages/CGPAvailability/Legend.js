import React from 'react';
import {THRESHOLDS} from './constants.js';

const Legend = () =>
    (<label className="legend-label" htmlFor="legend">{'Legend'}
        <div className="legend-container" id="legend">
            <div className="negative">{`< ${THRESHOLDS.medium}`}</div>
            <div className="attention">{`>= ${THRESHOLDS.medium}`}</div>
            <div className="positive">{`>= ${THRESHOLDS.high}`}</div>
        </div>
    </label>);

export default Legend;

