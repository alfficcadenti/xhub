import React, {useEffect, useState} from 'react';
import {withRouter} from 'react-router-dom';
import LoadingContainer from '../../components/LoadingContainer';
import HelpText from '../../components/HelpText/HelpText';
import {checkResponse} from '../utils';
import DataTable from '../../components/DataTable';
import moment from 'moment';
import {extractColumns, getAppErrorsDataForChart, mapAvailabilityRow, getSelectedRegions, getPresets} from './utils';
import ErrorCountModal from './ErrorCountModal';
import Legend from './Legend';
import {FormInput} from '@homeaway/react-form-components';
import MultiSelect from '@homeaway/react-multiselect-dropdown';
import {REGIONS} from './constants';
import './styles.less';
import {DatetimeRangePicker} from '../../components/DatetimeRangePicker';

const regions = [{
    name: 'all',
    label: 'All',
    checked: true,
    counted: false
}].concat(REGIONS.map((r) => ({
    name: r,
    label: r,
    checked: true,
    nested: true
})));

const CGPAvailibility = () => {
    const [availability, setAvailability] = useState([]);
    const [filteredAvailability, setFilteredAvailability] = useState(availability);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedApp, setSelectedApp] = useState(null);
    const [availabilityFilter, setAvailabilityFilter] = useState(100.00);
    const [errorMessage, setErrorMessage] = useState('');
    const [pendingRegionFilter, setPendingRegionFilter] = useState(regions);
    const [selectedRegionFilter, setSelectedRegionFilter] = useState(pendingRegionFilter);
    const [isDirtyForm, setIsDirtyForm] = useState(false);
    const [regionErrorMsg, setRegionErrorMsg] = useState('');
    const [start, setStart] = useState(moment().subtract(7, 'days'));
    const [end, setEnd] = useState(moment());
    const [pendingStart, setPendingStart] = useState(start);
    const [pendingEnd, setPendingEnd] = useState(end);

    useEffect(() => {
        const getNewData = () => {
            setIsLoading(true);
            setError('');
            const url = `/v1/application-availability/filter-by-aws-region?from_date=${start.format('YYYY-MM-DDTHH:mm:ss[Z]')}&to_date=${end.format('YYYY-MM-DDTHH:mm:ss[Z]')}&aws_region=${getSelectedRegions(selectedRegionFilter)}`;
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
            setIsDirtyForm(false);
        };
        getNewData();
    }, [selectedRegionFilter, start, end]);

    const handleOnClick = (selected) => setSelectedApp(selected || null);

    useEffect(() => {
        const newFilteredAvailability = availability.length && availability.filter((x) => x?.applicationName !== 'unknown').map((x) => mapAvailabilityRow(x, handleOnClick)).filter((x) => typeof x.avgValue === 'number' && x?.avgValue <= availabilityFilter);
        setFilteredAvailability(newFilteredAvailability);
    }, [availabilityFilter, availability]);

    useEffect(() => {
        if (availabilityFilter < 0 || availabilityFilter > 100) {
            setErrorMessage('Invalid value, 0 - 100 only');
        } else {
            setErrorMessage('');
        }
    }, [availabilityFilter]);

    const handleOnClose = () => setSelectedApp(null);

    const handleChange = (e) => setAvailabilityFilter(e?.target?.value);

    const handleRegionChange = (e) => {
        if (e.items.filter((x) => x.checked === true).length === 0) {
            setRegionErrorMsg('Field required. Choose at least one region');
            setIsDirtyForm(false);
            return;
        }
        setIsDirtyForm(true);
        setRegionErrorMsg('');
        setPendingRegionFilter(e.items);
        return;
    };

    const handleDatetimeChange = ({start: startDateTimeStr, end: endDateTimeStr}) => {
        setPendingStart(moment(startDateTimeStr).hours('00').minutes('00').seconds('00'));
        if (moment(endDateTimeStr).diff(moment(startDateTimeStr), 'days') < 15) {
            setPendingEnd(moment(endDateTimeStr).hours('23').minutes('59').seconds('59'));
        } else {
            setPendingEnd(moment(startDateTimeStr).hours('23').minutes('59').seconds('59').add(15, 'days'));
        }

        setIsDirtyForm(true);
    };

    const handleApplyButtonClicked = () => {
        setSelectedRegionFilter(pendingRegionFilter);
        setStart(pendingStart);
        setEnd(pendingEnd);
    };

    return (
        <div className="cgp-availability-container">
            <h1 className="page-title" data-testid="title">
                {'CGP Availability'}
                <HelpText className="page-info" text="Display the last 7 days availability for each application calculated monitoring the CGP logs as: (Total Requests - 5XX request) * 100) / Total Requests" />
            </h1>
            <div className="top-container">
                <div className="filter-container">
                    <DatetimeRangePicker
                        onChange={handleDatetimeChange}
                        startDate={pendingStart.toDate()}
                        endDate={pendingEnd.toDate()}
                        presets={getPresets()}
                        disabled={isLoading}
                        isValidEndDate={(currentDate) => currentDate.diff(pendingStart, 'days') < 15}
                    />
                    <MultiSelect
                        id="regionSelect"
                        className="region-select"
                        label="AWS Regions"
                        items={pendingRegionFilter}
                        onChange={handleRegionChange}
                        errorMsg={regionErrorMsg}
                        disabled={isLoading}
                    />
                    <button
                        type="button"
                        className="apply-button btn btn-primary active"
                        onClick={handleApplyButtonClicked}
                        disabled={!isDirtyForm}
                    >
                        {'Apply'}
                    </button>
                </div>
                <Legend/>
                <FormInput
                    id="availabilityFilter"
                    className="availability-filter"
                    type="number"
                    min={0}
                    max={100}
                    name="availabilityFilter"
                    label="Availability Filter"
                    onChange={handleChange}
                    value={availabilityFilter}
                    errorMsg={errorMessage}
                    disabled={isLoading}
                />
            </div>
            <LoadingContainer isLoading={isLoading} error={error}>
                <DataTable
                    data={filteredAvailability?.length && filteredAvailability || []}
                    columns={availability?.length ? extractColumns(availability) : []}
                    sortByColumn = "Availability"
                    sortByDirection = "asc"
                    paginated
                    enableTextSearch
                    enableCSVDownload
                    columnsInfo={{'Availability': 'Availability for the time frame calculated as: (Total Requests - 5XX request) * 100) / Total Requests'}}
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
