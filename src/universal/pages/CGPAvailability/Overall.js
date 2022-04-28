import React from 'react';
import AvailabilityCell from './AvailabilityCell';

const Overall = ({totalRequests, totalErrors}) =>
    (<label className="overall-label" htmlFor="overall">{'Overall Availability'}
        <div className="overall-container" id="overall">
            <AvailabilityCell value={((totalRequests - totalErrors) / totalRequests * 100)}/>
        </div>
    </label>);

export default Overall;

