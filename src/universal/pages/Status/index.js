import React, {useEffect, useState} from 'react';
import DataTable from '@homeaway/react-data-table';
import './styles.less';
import {LIST_OF_SERVICES} from './constants';
import rowComponent from './rowComponent';
import {compareArraysElements} from './utils';
import {checkResponse} from '../utils';

const StatusPage = () => {
    // eslint-disable-next-line no-unused-vars
    const [services, setServices] = useState(LIST_OF_SERVICES);

    useEffect(() => {
        Promise.all(LIST_OF_SERVICES.map(({endpoint}) => fetch(endpoint)))
            .then((res) => Promise.all(res.map(checkResponse)))
            .then((allData) => setServices(LIST_OF_SERVICES.map((service, idx) => {
                if (compareArraysElements(allData[idx], service.expectedResponse)) {
                    service.status = true;
                }
                return service;
            })))
            .catch((err) => {
                // eslint-disable-next-line no-console
                console.error(err);
            });
    }, []);

    const rows = LIST_OF_SERVICES.map((service) => rowComponent({name: service.name, endpointName: service.endpointName, status: service.status}));

    return (
        <div className="status-page-container">
            <h1 className="page-title" data-testid="title">{'Status Page'}</h1>
            <DataTable
                headers={[{name: 'Service Name'}, {name: 'Endpoint'}, {name: 'Status'}]}
                rows={rows}
                colConfig={{flex: {0: 2, 1: 3, 2: 1}}}
            />
        </div>
    );
};

export default StatusPage;