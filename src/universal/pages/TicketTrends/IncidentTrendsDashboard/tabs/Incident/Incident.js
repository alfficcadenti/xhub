import React, {useEffect, useState} from 'react';
import DataTable from '../../../../../components/DataTable';
import {getIncidentsDataById} from '../../../incidentsHelper';
import FormInput from '@homeaway/react-form-components/lib/transpiled/FormInput';
import {checkResponse, consolidateTicketsById} from '../../../../utils';
import {FETCH_FAILED_MSG} from '../../../../../constants';
import {getTableColumnsForIncident} from '../../../incidentsHelper';
import { COLUMNS_INFO } from '../../constants';
import LoadingContainer from '../../../../../components/LoadingContainer';


const Incident = () => {
    const [search, setSearch] = useState('');
    const [pendingSearch, setPendingSearch] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [data, setData] = useState([]);

    useEffect(() => {
        setIsLoading(true);
        fetch(`/v1/incidents/${search}`)
            .then(checkResponse)
            .then((x) => setData(getIncidentsDataById(consolidateTicketsById(x)) || []))
            .catch(() => setError(FETCH_FAILED_MSG))
            .finally(() => setIsLoading(false));
    }, [search]);

    const renderTable = () => {
        return (
            <LoadingContainer isLoading={isLoading} >
            <DataTable
                title={'Incident details'}
                data={data}
                columns={getTableColumnsForIncident()}
                columnsInfo={COLUMNS_INFO}
                expandableColumns={['Details']}
                paginated={false}
            />
            </LoadingContainer>
        );
    };

    return (
        <div >
            <div className="form-container fci-container">
                <FormInput
                    id="search-input"
                    name="searchInput"
                    label="Search incident by ID"
                    className="fci-search-input"
                    value={pendingSearch}
                    onChange={(e) => setPendingSearch(e.target.value)}
                />
                <button
                    className="btn btn-primary apply-btn"
                    type="button"
                    onClick = {(() => setSearch(pendingSearch))}
                >
                    {'Search'}
                </button>
            </div>
            <div>
                {
                    search && renderTable()
                }
            </div>
        </div>
    );
};

export default Incident;

