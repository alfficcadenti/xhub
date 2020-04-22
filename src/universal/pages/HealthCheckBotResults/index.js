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

    useEffect(() => {
        fetch('availability/s3bucket')
            .then((response) => response.json())
            .then((response) => {
                const getTableData = (data) => {
                    return data.map((item) => {
                        const utcLocal = moment.utc(item.runDateTime).local();
                        const isFailedStatus = (system) => system.status === 'failed';

                        return {
                            'Date': utcLocal.isValid() ? utcLocal.format('YYYY-MM-DD HH:mm') : '-',
                            ['Overall Results']: item.result.some(isFailedStatus) ? <CircleDot isSuccess={false} /> : <CircleDot />,
                            'SubSystems': (
                                <DataTable
                                    className="linked-issues__table"
                                    data={item.result.map((subSystem) => ({
                                        Description: subSystem.description,
                                        Status: isFailedStatus(subSystem) ? <CircleDot isSuccess={false} /> : <CircleDot />,
                                        Comments: subSystem.comments ? subSystem.comments : '-'
                                    }))}
                                    columns={['Description', 'Status', 'Comments']}
                                />
                            )
                        };
                    });
                };
                const primaryTableData = getTableData(response);
                setHealthCheckData(primaryTableData);
                setIsLoading(false);
            })
            .catch((err) => {
                // eslint-disable-next-line no-console
                console.error(err);
                setError('Could not retrieve health check bot results data. Refresh the page to try again.');
                setIsLoading(false);
            });
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
