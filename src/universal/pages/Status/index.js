import React, {useEffect, useState} from 'react';
import DataTable from '@homeaway/react-data-table';
import './styles.less';
import {ListOfService} from './ListOfService';
import rowComponent from './rowComponent';
import {check} from './utils';

const StatusPage = () => {
    const [listOfServiceObj, setlistOfServiceObj] = useState(ListOfService);

    useEffect(() => {
        Promise.all(listOfServiceObj.map((eachService) =>
            fetch(eachService.endpoint)))
            .then((res) => {
                return Promise.all(res.map((response) => {
                    return response.json();
                }));
            })
            .then((allData) => {
                const listOf = listOfServiceObj.map((eachService, idx) => {
                    console.log('start elem', eachService);

                    if (check(allData[idx], eachService.expectedResponse)) {
                        eachService.status = true;
                    }
                    return eachService;
                });
                console.log('end', listOf);
                setlistOfServiceObj(listOf);
            })

            .catch((err) => {
                // eslint-disable-next-line no-console
                console.error(err);
            });
    }, []);

    const rows = listOfServiceObj.map((service) => rowComponent({name: service.name, endpointName: service.endpointName, status: service.status}));

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