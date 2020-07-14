/* eslint-disable no-use-before-define */
import React, {Fragment, useState, useEffect} from 'react';
import moment from 'moment';
import LoadingContainer from '../../components/LoadingContainer';
import DataTable from '../../components/DataTable';
import CircleDot from '../../components/CircleDot';
import {useSelectedBrand} from '../hooks';
import './styles.less';


const HealthCheckBotResults = ({selectedBrands}) => {
    const [healthCheckData, setHealthCheckData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    useSelectedBrand(selectedBrands[0]);

    const isFailedStatus = (system) => system.status === 'failed';
    const isWarningStatus = (system) => system.status === 'warning';

    const getOverallResult = (result) => {
        let overallResult;

        switch (true) {
            case (result.some(isFailedStatus)):
                overallResult = 'failed';
                break;
            case (result.some(isWarningStatus)):
                overallResult = 'warning';
                break;
            default:
                overallResult = 'success';
        }

        return overallResult;
    };

    const mapSubSystem = (subSystem) => ({
        Description: subSystem.description,
        Status: subSystem.status === 'No Data' ? subSystem.status : <CircleDot status={subSystem.status} />,
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
        ['Overall Results']: <CircleDot status={getOverallResult(item.result)} />,
        'SubSystems': (
            <DataTable
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
            <div className="health-check-results-wrapper">
                <h1 className="page-title">{'Health Check Bot Results'}</h1>
                <LoadingContainer isLoading={isLoading} error={error} id="health-check-bot">
                    <DataTable
                        className="health-check-table-wrapper"
                        data={healthCheckData || []}
                        columns={['Date', 'Overall Results']}
                        expandableColumns={['SubSystems']}
                        paginated
                        pageSize={15}
                    />
                    <div className="status-description-wrapper">
                        <div className="status-description-label">
                            <span>{'*results status description:'}</span>
                        </div>
                        <div className="status-description">
                            <CircleDot status="success" />
                            <span className="divider">{'-'}</span>
                            <span>{'successful status'}</span>
                        </div>
                        <div className="status-description">
                            <CircleDot status="warning" />
                            <span className="divider">{'-'}</span>
                            <span>{'have some warnings'}</span>
                        </div>
                        <div className="status-description">
                            <CircleDot status="failed" />
                            <span className="divider">{'-'}</span>
                            <span>{'failed status'}</span>
                        </div>
                    </div>
                </LoadingContainer>
            </div>
        </Fragment>
    );
};

export default HealthCheckBotResults;
