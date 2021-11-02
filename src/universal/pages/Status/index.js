import React, {useEffect, useState} from 'react';
import DataTable from '@homeaway/react-data-table';
import './styles.less';
import DisplayStatus from './DisplayStatus';
import EndpointConfig from './EndpointConfig';

const StatusPage = () => {
    const [isItWorking, setIsItWorking] = useState();
    const endpoints = EndpointConfig;

    useEffect(() => {
        fetch(endpoints.checkoutFailureSites)
            .then(
                (response) => {
                    if (response.status === 200) {
                        setIsItWorking(true);
                    } else {
                        setIsItWorking(false);
                    }
                })
            .catch((err) => {
                console.error(err);
            });
    }, []);
    return (
        <div className="status-page-container">
            <h1 className="page-title" data-testid="title">Status Page</h1>
            <DataTable
                headers={[{name: 'Service Name'}, {name: 'Endpoint'}, {name: 'Status'}]}
                rows={[
                    {cols: [<div><a href="https://github.expedia.biz/eg-reo-opex/eg-fci-data-service" target="_blank" >eg-fci-data-service </a>
                        <img src={require('../../img/github.png').default} height="24" width="24" alt="github" title="github" /></div>,
                    <div>{'/v1/checkout-failures/sites'}</div>,
                    <div> <DisplayStatus isItWorking={isItWorking} /></div>]},
                    {cols: [<div/>, <div />, <div> </div>]},
                ]}
                colConfig={{flex: {0: 2, 1: 3, 2: 1}}}
            />
        </div>
    );
};


export default StatusPage;