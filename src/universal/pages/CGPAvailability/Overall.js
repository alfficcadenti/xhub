import React from 'react';
import AvailabilityCell from './AvailabilityCell';

const Overall = ({totalRequests, totalErrors, onClickHandler}) =>
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    (<label className="overall-label" htmlFor="overall" onClick={() => onClickHandler()} onKeyUp={() => onClickHandler()}>{'Overall Availability'}
        <div className="overall-container" id="overall">
            <AvailabilityCell value={((totalRequests - totalErrors) / totalRequests * 100)}/>
        </div>
    </label>);

export default Overall;

