import React, {useEffect, useState} from 'react';
import FormInput from '@homeaway/react-form-components/lib/transpiled/FormInput';
import {checkResponse, consolidateTicketsById} from '../../../../utils';
import {FETCH_FAILED_MSG} from '../../../../../constants';
import {formatObjectFromIncidentArray} from '../../../incidentsHelper';
import LoadingContainer from '../../../../../components/LoadingContainer';
import {INCIDENT_COLUMNS, INCIDENT_COLUMNS_LONG} from '../../../../Fci/constants';
import './styles.less';


const Incident = () => {
    const [search, setSearch] = useState('');
    const [pendingSearch, setPendingSearch] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [data, setData] = useState([]);

    useEffect(() => {
        setIsLoading(true);
        async function fetchData() {
            try {
                const response = await fetch(`/v1/incidents/${search}`);
                const resJson = await checkResponse(response);
                setData(formatObjectFromIncidentArray(consolidateTicketsById(resJson)?.[0]));
                setError('');
            } catch (e) {
                setError(FETCH_FAILED_MSG);
            }
        }
        fetchData().finally(() => setIsLoading(false));
    }, [search]);


    const renderRow = (label, value) => {
        return (
            <div className="inc-row" key={label}>
                <div className="inc-label">{label}</div>
                <div className="inc-value">{value ? value : '-'}</div>
            </div>
        );
    };

    const renderLongRow = (label, value) => {
        return (
            <div className="inc-long-row" key={label}>
                <div className="inc-long-label">{label}</div>
                <div className="inc-long-value">{value ? value : '-'}</div>
            </div>
        );
    };

    const renderTable = () => {
        return (
            <LoadingContainer isLoading={isLoading} error={error} >
                <div className="inc-details-container">
                    <div id="shortDetails">
                        {INCIDENT_COLUMNS
                            .map((column) => renderRow(column, data?.[column]))}
                    </div>
                    <div id="longDetails">
                        {INCIDENT_COLUMNS_LONG
                            .map((column) => renderLongRow(column, data?.[column]))}
                    </div>
                </div>
            </LoadingContainer>
        );
    };

    return (
        <div >
            <div className="inc-form-container">
                <FormInput
                    id="searchInput"
                    name="searchInput"
                    label="Search incident by ID"
                    className="inc-search-input"
                    value={pendingSearch}
                    onChange={(e) => setPendingSearch(e.target.value)}
                />
                <button
                    className="btn btn-primary search-btn"
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

