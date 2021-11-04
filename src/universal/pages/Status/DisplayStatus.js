import React from 'react';
import {SUCCESS__24, ALERT__24} from '@homeaway/svg-defs';
import {SVGIcon} from '@homeaway/react-svg';

const DisplayStatus = ({status}) => (
    status
        ? <SVGIcon id="successIcon" className="success-icon" markup={SUCCESS__24} data-testid="successIcon"/>
        : <SVGIcon className="fail-icon" markup={ALERT__24} data-testid="failIcon" alt="failIcon"/>
);

export default DisplayStatus;