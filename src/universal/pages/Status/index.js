import React, {useEffect, useState} from 'react';
import DataTable from '@homeaway/react-data-table';
import './styles.less';
import ListOfService from './ListOfService';
import rowComponent from './rowComponent';

const StatusPage = () => {
    const listOfService = ListOfService;
    const [isItWorking, setIsItWorking] = useState();

    useEffect(() => {
        fetch(listOfService.map(((service) => service.endpoint)))
            .then((response) => setIsItWorking(response.status === 200))
            .catch((err) => {
                // eslint-disable-next-line no-console
                console.error(err);
            });
    }, []);

    const rows = listOfService.map((service) => rowComponent({name: service.name, endpointName: service.endpointName, status: isItWorking}));

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