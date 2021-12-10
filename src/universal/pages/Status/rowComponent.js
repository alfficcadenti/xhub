import React from 'react';
import DisplayStatus from './DisplayStatus';
import ServiceName from './ServiceName';

const rowComponent = ({name, endpointName, status}) =>
    ({cols: [<ServiceName service={name}/>,
        endpointName,
        <DisplayStatus status={status}/>]
    });

export default rowComponent;