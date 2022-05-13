import React, {useEffect, useState} from 'react';
import DataTable from '@homeaway/react-data-table';
import './styles.less';
import {LIST_OF_SERVICES} from './constants';
import {rowComponent, toolTip} from './rowComponent';
import {timeout, compareObjArraysElements} from './utils';
import {checkResponse} from '../utils';

const StatusPage = () => {
    const [_, setServices] = useState(LIST_OF_SERVICES);

    useEffect(() => {
        Promise.all(LIST_OF_SERVICES.map(({endpoint}) => fetch(endpoint, {signal: timeout(5).signal})))
            .then((res) => Promise.all(res.map(checkResponse)))
            .then((allData) => setServices(LIST_OF_SERVICES.map((service, idx) => {
                if (compareObjArraysElements(allData[idx], service.expectedResponse)) {
                    service.status = true;
                }
                return service;
            })))
            .catch((err) => {
                if (err.name === 'AbortError') {
                    console.error('Response timed out');
                } else {
                    console.error(err);
                }
            });
    }, []);

    const rows = LIST_OF_SERVICES.map((service) => rowComponent({name: service.name, endpointName: service.endpointName, status: service.status, endpoint: service.endpoint}));
    const statusToolTip = toolTip();

    return (
        <div className="status-page-container">
            <h1 className="page-title" data-testid="title">{'Status Page'}</h1>
            <DataTable
                headers={[{name: 'Service Name'}, {name: 'Endpoint'}, {name: statusToolTip}]}
                rows={rows}
                colConfig={{flex: {0: 2, 1: 3, 2: 1}}}
            />
        </div>
    );
};

export default StatusPage;