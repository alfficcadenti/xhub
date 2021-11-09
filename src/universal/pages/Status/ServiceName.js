import React from 'react';

const ServiceName = ({service}) => (
    <>
        <a href={`https://github.expedia.biz/eg-reo-opex/${service}`}
            target="_blank"
        >{service}</a>
        <img src={require('../../img/github.png').default} height="24" width="24" alt="github" title="github"/>

    </>
);

export default ServiceName;