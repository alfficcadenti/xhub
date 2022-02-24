import React, {useEffect, useState} from 'react';
import FormInput from '@homeaway/react-form-components/lib/transpiled/FormInput';
import {checkResponse, consolidateTicketsById} from '../../../../utils';
import {FETCH_FAILED_MSG} from '../../../../../constants';
import {formatObjectFromIncident} from '../../../incidentsHelper';
import LoadingContainer from '../../../../../components/LoadingContainer';
import {INCIDENT_COLUMNS, INCIDENT_COLUMNS_LONG} from '../../../../Fci/constants';
import './styles.less';
import NoResults from '../../../../../components/NoResults';


const Incident = () => {
    const [search, setSearch] = useState('');
    const [pendingSearch, setPendingSearch] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [data, setData] = useState({});

    useEffect(() => {
        setIsLoading(true);
        async function fetchData() {
            try {
                const response = await fetch(`/v1/incidents/${search}`);
                const resJson = await checkResponse(response);
                setData(resJson.length ? formatObjectFromIncident(consolidateTicketsById(resJson)?.[0]) : {});
                setError('');
            } catch (e) {
                setError(FETCH_FAILED_MSG);
            }
        }
        fetchData().finally(() => setIsLoading(false));
    }, [search]);


    const renderRow = (label, value, type) =>
        (<div className={`inc-row${type === 'long' ? '-long' : ''}`} key={label}>
            <div className={`inc-label${type === 'long' ? '-long' : ''}`}>{label}</div>
            <div className={`inc-value${type === 'long' ? '-long' : ''}`}>{value}</div>
        </div>);

    const renderTable = () => {
        return (
            <div className="inc-details-container">
                <div id="shortDetails">
                    {INCIDENT_COLUMNS
                        .map((column) => renderRow(column, data?.[column]))}
                </div>
                <div id="longDetails">
                    {INCIDENT_COLUMNS_LONG
                        .map((column) => renderRow(column, data?.[column], 'long'))}
                </div>
            </div>
        );
    };

    const renderResults = () => {
        if (search) {
            return (
                <LoadingContainer isLoading={isLoading} error={error} >
                    {Object.keys(data).length !== 0 ? renderTable() : <NoResults /> }
                </LoadingContainer>
            );
        }
        return null;
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
            {renderResults()}
        </div>
    );
};

export default Incident;

