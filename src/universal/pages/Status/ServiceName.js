import React from 'react';

const ServiceName = ({service}) => (
    <>
        {service === 'eg-fci-data-service'
            ? (<a href={`https://spawg-dp.expedia.biz/dashboards/${service}/state/`} className={'serviceName'} target="_blank" rel="noopener noreferrer">{service}</a>)
            : (<a href={`https://spinnaker.expedia.biz/#/applications/${service}/executions/`} className={'serviceName'} target="_blank" rel="noopener noreferrer">{service}</a>)}
        <a href={`https://github.expedia.biz/eg-reo-opex/${service}`} className={'serviceName'} target="_blank" rel="noopener noreferrer">
            <img src={require('../../img/github.png').default} height="24" width="24" alt="github" title="github"/>
        </a>
    </>
);

export default ServiceName;