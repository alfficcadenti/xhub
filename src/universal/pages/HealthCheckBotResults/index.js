/* eslint-disable no-use-before-define */
import React, {Fragment, useState, useEffect} from 'react';
import moment from 'moment';
import LoadingContainer from '../../components/LoadingContainer';
import DataTable from '../../components/DataTable';
import CircleDot from '../../components/CircleDot';
import './styles.less';


const HealthCheckBotResults = () => {
    const [healthCheckData, setHealthCheckData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const isFailedStatus = (system) => system.status === 'failed';

    const mapSubSystem = (subSystem) => ({
        Description: subSystem.description,
        Status: <CircleDot isSuccess={!(isFailedStatus(subSystem))} />,
        Comments: subSystem.comments ? subSystem.comments : '-'
    });

    const getUtcLocalDate = (date) => {
        const utcLocal = moment.utc(date).local();
        return utcLocal.isValid()
            ? utcLocal.format('YYYY-MM-DD HH:mm')
            : '-';
    };

    const sortByDate = (a, b) => String(b.Date).localeCompare(a.Date);

    const mapData = (item) => ({
        'Date': getUtcLocalDate(item.runDateTime),
        ['Overall Results']: <CircleDot isSuccess={!item.result.some(isFailedStatus)} />,
        'SubSystems': (
            <DataTable
                className="linked-issues__table"
                data={item.result.map(mapSubSystem)}
                columns={['Description', 'Status', 'Comments']}
            />
        )
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('availability/s3bucket');
                const data = await response.json();
                setHealthCheckData(data.map(mapData).sort(sortByDate));
                setIsLoading(false);
            } catch (err) {
                // eslint-disable-next-line no-console
                console.error(err);
                setError('Could not retrieve health check bot results data. Refresh the page to try again.');
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <Fragment>
            <h1 className="page-title">{'Health Check Bot Results'}</h1>
            <LoadingContainer isLoading={isLoading} error={error} id="health-check-bot">
                <DataTable
                    className="health-check-table-wrapper"
                    data={healthCheckData || []}
                    columns={['Date', 'Overall Results']}
                    expandableColumns={['SubSystems']}
                />
            </LoadingContainer>
        </Fragment>
    );
};

export default HealthCheckBotResults;
