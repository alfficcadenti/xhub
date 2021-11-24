import React, {useEffect, useState} from 'react';
import DataTable from '../../../../../components/DataTable';
import {getIncidentsDataById} from '../../../incidentsHelper';
import FormInput from '@homeaway/react-form-components/lib/transpiled/FormInput';
import LoadingContainer from '../../../../../components/LoadingContainer';
import {checkResponse, consolidateTicketsById} from '../../../../utils';
import {FETCH_FAILED_MSG} from '../../../../../constants';
import {getTableColumnsForIncident} from '../../../incidentsHelper';
import NoResults from '../../../../../components/NoResults';


const Incident = () => {
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [id] = useState('');
    const [data, setData] = useState([]);
    const columns = getTableColumnsForIncident();
    const columnsInfo = {
        TTD: <div>{'Time to Detect: target <=15m'}</div>,
        TTK: <div>{'Time to Know: target <=30m'}</div>,
        TTF: <div>{'Time to Fix: target <=15m'}</div>,
        TTR: <div>{'Time to Restore: target <=60m'}</div>,
        Incident: <div>{'SNOW license needed to get full incident details'}</div>};

    const fetchIncident = (incId) => {
        fetch(`/v1/incidents/${incId}`)
            .then(checkResponse)
            .then((x) => setData(x))
            .catch(() => setError(FETCH_FAILED_MSG))
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        setIsLoading(true);
        fetchIncident(id);
    }, [id]);

    const renderTable = () => {
        return (
            <DataTable
                title={'Incident details'}
                data={getIncidentsDataById(consolidateTicketsById(data)) || []}
                columns={columns}
                columnsInfo={columnsInfo}
                expandableColumns={['Details']}
                paginated={false}
            />
        );
    };

    return (
        <div>
            <div className="form-container">
                <FormInput
                    id="search-input"
                    name="searchInput"
                    label="Search incident by ID"
                    className="fci-search-input"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button
                    className="btn btn-primary apply-btn"
                    type="button"
                    onClick = {(() => fetchIncident(search))}
                >
                    {'Search'}
                </button>
            </div>

            <LoadingContainer isLoading={isLoading} error={error}>
                {
                    data.length
                        ? renderTable()
                        : <NoResults />
                }
            </LoadingContainer>
        </div>
    );
};

export default Incident;

