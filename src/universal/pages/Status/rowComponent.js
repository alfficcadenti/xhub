import React from 'react';
import DisplayStatus from './DisplayStatus';
import ServiceName from './ServiceName';
import Tooltip from '@homeaway/react-tooltip';
import {SVGIcon} from '@homeaway/react-svg';
import {INFO__16} from '@homeaway/svg-defs';

export const rowComponent = ({name, endpointName, status, endpoint}) =>
    ({cols: [<ServiceName service={name}/>,
        <a href={`https://opxhub-ui.us-east-1.prod.expedia.com${endpoint}`} className={'serviceName'}
            target="_blank"
        >{endpointName}</a>,
        <DisplayStatus status={status}/>]
    });

export const toolTip = () => (
    <div>
        <strong>{'Status'} </strong>
        <Tooltip content="Checks status of API response data. Green tick signifies response data is correctly returned. Red alert icon signifies service is not returning the correct response data and is faulty."> <SVGIcon markup={INFO__16} /></Tooltip>
    </div>
);

export default rowComponent;