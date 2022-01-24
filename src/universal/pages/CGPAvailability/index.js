import React, {useEffect, useState} from 'react';
import {withRouter} from 'react-router-dom';
import LoadingContainer from '../../components/LoadingContainer';
import HelpText from '../../components/HelpText/HelpText';
import {checkResponse} from '../utils';
import DataTable from '../../components/DataTable';
import moment from 'moment';
import {extractColumns, filterAvailabilityByMinValue, getAppErrorsDataForChart, mapAvailabilityRow} from './utils';
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
    const [availabilityFilter, setAvailabilityFilter] = useState(100);


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

    useEffect(() => {
        setFilteredAvailability(availability.filter((x) => filterAvailabilityByMinValue(x, availabilityFilter)));
    }, [availabilityFilter, availability]);

    const handleOnClick = (selected) => setSelectedApp(selected || null);

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
                    <Legend />
                    <FormInput
                        id="availabilityFilter"
                        type="number"
                        name="availabilityFilter"
                        label="Availability Filter"
                        onChange={handleChange}
                        value={availabilityFilter}
                    />
                </div>
                <DataTable
                    data={filteredAvailability?.length ? filteredAvailability?.map((x) => mapAvailabilityRow(x, handleOnClick)) : []}
                    columns={filteredAvailability?.length ? extractColumns(filteredAvailability) : []}
                    paginated
                    enableTextSearch
                    enableCSVDownload
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