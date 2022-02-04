import React, {useEffect, useState} from 'react';
import {withRouter} from 'react-router-dom';
import LoadingContainer from '../../components/LoadingContainer';
import HelpText from '../../components/HelpText/HelpText';
import {checkResponse} from '../utils';
import DataTable from '../../components/DataTable';
import moment from 'moment';
import {extractColumns, getAppErrorsDataForChart, mapAvailabilityRow} from './utils';
import ErrorCountModal from './ErrorCountModal';
import Legend from './Legend';
import {FormInput} from '@homeaway/react-form-components';
import './styles.less';

const CGPAvailibility = () => {
    const [availability, setAvailability] = useState([]);
    const [filteredAvailability, setFilteredAvailability] = useState(availability);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedApp, setSelectedApp] = useState(null);
    const [availabilityFilter, setAvailabilityFilter] = useState(100.00);
    const [errorMessage, setErrorMessage] = useState('');


    useEffect(() => {
        setIsLoading(true);
        setError('');
        const url = `/v1/application-availability?from_date=${moment().subtract(7, 'days').format('YYYY-MM-DDTHH:mm:ss[Z]')}&to_date=${moment().format('YYYY-MM-DDTHH:mm:ss[Z]')}`;
        const fetchAPI = async () => {
            try {
                const res = await fetch(url);
                const resJson = await checkResponse(res);
                await setAvailability(resJson);
            } catch (e) {
                setError('Error loading CGP Availability. Try refreshing the page');
            }
        };
        fetchAPI()
            .finally(() => setIsLoading(false));
    }, []);

    const handleOnClick = (selected) => setSelectedApp(selected || null);

    useEffect(() => {
        const mappedAvailability = availability?.map((x) => mapAvailabilityRow(x, handleOnClick));
        setFilteredAvailability(mappedAvailability.filter((x) => x?.avgValue <= availabilityFilter));
    }, [availabilityFilter, availability]);

    useEffect(() => {
        if (availabilityFilter > 100) {
            setErrorMessage('Max Value 100');
        } else {
            setErrorMessage('');
        }
    }, [availabilityFilter]);

    const handleOnClose = () => setSelectedApp(null);

    const handleChange = (e) => setAvailabilityFilter(e?.target?.value);

    return (
        <div className="cgp-availability-container">
            <h1 className="page-title" data-testid="title">
                {'CGP Availability'}
                <HelpText className="page-info" text="Display the last 7 days availability for each application calculated monitoring the CGP logs as: (Total Requests - 5XX request) * 100) / Total Requests" />
            </h1>
            <LoadingContainer isLoading={isLoading} error={error}>
                <div id="topContainer">
                    <Legend/>
                    <FormInput
                        id="availabilityFilter"
                        type="number"
                        name="availabilityFilter"
                        label="Availability Filter"
                        onChange={handleChange}
                        value={availabilityFilter}
                        errorMsg={errorMessage}
                    />
                </div>
                <DataTable
                    data={filteredAvailability?.length && filteredAvailability || []}
                    columns={availability?.length ? extractColumns(availability) : []}
                    sortByColumn = "Average"
                    sortByDirection = "asc"
                    paginated
                    enableTextSearch
                    enableCSVDownload
                    columnsInfo={{'Average': 'Average availability for the time frame calculated as: (Total Requests - 5XX request) * 100) / Total Requests'}}
                />
                <ErrorCountModal
                    isOpen={Boolean(selectedApp)}
                    onClose={handleOnClose}
                    app={selectedApp}
                    errorsData={selectedApp && getAppErrorsDataForChart(selectedApp, availability)}
                />
            </LoadingContainer>
        </div>
    );
};

export default withRouter(CGPAvailibility);
