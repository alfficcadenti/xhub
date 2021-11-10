import React from 'react';
import {SUCCESS__24, ALERT__24} from '@homeaway/svg-defs';
import {SVGIcon} from '@homeaway/react-svg';

const DisplayStatus = ({status}) => (
    status
        ? <div data-testid="successIcon"><SVGIcon id="successIcon" className="success-icon" markup={SUCCESS__24} /></div>
        : <div data-testid="failIcon"><SVGIcon className="fail-icon" markup={ALERT__24} alt="failIcon"/></div>
);

export default DisplayStatus;