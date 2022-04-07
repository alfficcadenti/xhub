import React, {useEffect, useState} from 'react';
import {useLocation, withRouter} from 'react-router-dom';
import LoadingContainer from '../../components/LoadingContainer';
import HelpText from '../../components/HelpText/HelpText';
import {checkResponse} from '../utils';
import DataTable from '../../components/DataTable';
import moment from 'moment';
import {extractColumns, getAppErrorsDataForChart, mapAvailabilityRow, getSelectedRegions, getPresets, getQueryValues} from './utils';
import ErrorCountModal from './ErrorCountModal';
import Legend from './Legend';
import {FormInput} from '@homeaway/react-form-components';
import MultiSelect from '@homeaway/react-multiselect-dropdown';
import Tooltip from '@homeaway/react-tooltip';
import {REGIONS} from './constants';
import './styles.less';
import {DatetimeRangePicker} from '../../components/DatetimeRangePicker';
import AvailabilityHeader from './AvailabilityHeader';
import {DATE_FORMAT, DATETIME_FORMAT, API_UTC_FORMAT} from './constants';

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

// eslint-disable-next-line complexity
const CGPAvailibility = () => {
    const {search} = useLocation();
    const {kioskMode} = getQueryValues(search);
    const [availability, setAvailability] = useState([]);
    const [filteredAvailability, setFilteredAvailability] = useState(availability);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedApp, setSelectedApp] = useState(null);
    const [availabilityFilter, setAvailabilityFilter] = useState(100.00);
    const [applicationFilter, setApplicationFilter] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [pendingRegionFilter, setPendingRegionFilter] = useState(regions);
    const [selectedRegionFilter, setSelectedRegionFilter] = useState(pendingRegionFilter);
    const [isDirtyForm, setIsDirtyForm] = useState(false);
    const [regionErrorMsg, setRegionErrorMsg] = useState('');
    const [start, setStart] = useState(kioskMode ? moment().utc().subtract(59, 'minutes') : moment().utc().subtract(7, 'days'));
    const [end, setEnd] = useState(moment().utc());
    const [pendingStart, setPendingStart] = useState(start);
    const [pendingEnd, setPendingEnd] = useState(end);
    const [dateTimeFormat, setDateTimeFormat] = useState(DATE_FORMAT);

    useEffect(() => {
        const getNewData = () => {
            setIsLoading(true);
            setError('');
            const url = `/v1/application-availability/filters?from_date=${start.format(API_UTC_FORMAT)}&to_date=${end.format(API_UTC_FORMAT)}&aws_region=${getSelectedRegions(selectedRegionFilter)}`;
            const fetchAPI = async () => {
                try {
                    const res = await fetch(url);
                    const resJson = await checkResponse(res);
                    if (!Array.isArray(resJson)) {
                        throw new Error(resJson);
                    }
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

        if (end.diff(start, 'days') >= 1) {
            setDateTimeFormat(DATE_FORMAT);
        } else {
            setDateTimeFormat(DATETIME_FORMAT);
        }
    }, [selectedRegionFilter, start, end]);

    const setAutoRefresh = () => {
        setInterval(() => {
            setStart(moment().utc().seconds(0).subtract(59, 'minutes'));
            setEnd(moment().utc().seconds(0));
        }, 60000); // REFRESH EVERY 1 MINUTE
    };

    useEffect(() => {
        const refreshStartInternal = kioskMode && setAutoRefresh();
        return () => {
            clearInterval(refreshStartInternal);
        };
    }, []);

    const handleOnClick = (selected) => setSelectedApp(selected || null);

    useEffect(() => {
        const newFilteredAvailability = (availability || [])
            .filter((x) => x?.applicationName !== 'unknown')
            .map((x) => mapAvailabilityRow(x, handleOnClick, dateTimeFormat))
            .filter((x) => typeof x.avgValue === 'number' && x.avgValue <= availabilityFilter && x.app.includes(applicationFilter));
        setFilteredAvailability(newFilteredAvailability);
    }, [availabilityFilter, applicationFilter, availability, dateTimeFormat]);

    useEffect(() => {
        if (availabilityFilter < 0 || availabilityFilter > 100) {
            setErrorMessage('Invalid value, 0 - 100 only');
        } else {
            setErrorMessage('');
        }
    }, [availabilityFilter]);

    const handleOnClose = () => setSelectedApp(null);

    const handleAvailabilityFilterChange = (e) => setAvailabilityFilter(e?.target?.value);

    const handleApplicationFilterChange = (e) => setApplicationFilter(e?.target?.value);

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
        setPendingStart(moment(startDateTimeStr));
        if (moment(endDateTimeStr).diff(moment(startDateTimeStr), 'days') <= 30) {
            setPendingEnd(moment(endDateTimeStr));
        } else {
            setPendingEnd(moment(startDateTimeStr).hours('23').minutes('59').seconds('59').add(30, 'days'));
        }
        setIsDirtyForm(true);
    };

    const handleApplyButtonClicked = () => {
        setSelectedRegionFilter(pendingRegionFilter);
        setStart(pendingStart);
        setEnd(pendingEnd);
    };

    const handleHeaderClick = (header) => {
        if (moment(header, DATE_FORMAT).isValid()) {
            const newStart = moment(header, DATE_FORMAT).tz('America/Los_Angeles').hours(0).minutes(0).seconds(0);
            const newEnd = moment(header, DATE_FORMAT).tz('America/Los_Angeles').hours(23).minutes(59).seconds(0);
            setPendingEnd(newStart);
            setPendingEnd(newEnd);
            setStart(newStart);
            setEnd(newEnd);
        }
    };

    const headers = () => {
        const columns = availability?.length ? extractColumns(availability, end.diff(start, 'days') >= 1 ? 'Do MMM YY' : 'HH:mm') : [];
        return columns.length ? columns.reduce((a, content) => ({...a, [content]: <AvailabilityHeader content={content} dateTimeFormat={dateTimeFormat} handleHeaderClick={handleHeaderClick} />}), {}) : {};
    };

    const renderFilters = () => (
        <div className="top-container">
            <div className="filter-container">
                <DatetimeRangePicker
                    onChange={handleDatetimeChange}
                    startDate={pendingStart.toDate()}
                    endDate={pendingEnd.toDate()}
                    presets={getPresets()}
                    disabled={isLoading}
                    isValidEndDate={(currentDate) => currentDate.diff(pendingStart, 'days') <= 30}
                    showTimePicker
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
            <Tooltip tooltipType="tooltip--lg" content={'Display only applications with availability lower than the specified value'} placement="top" fullWidth>
                <FormInput
                    id="availabilityFilter"
                    className="availability-filter"
                    type="number"
                    min={0}
                    max={100}
                    name="availabilityFilter"
                    label="Availability Filter"
                    onChange={handleAvailabilityFilterChange}
                    value={availabilityFilter}
                    errorMsg={errorMessage}
                    disabled={isLoading}
                />
            </Tooltip>
            <FormInput
                id="applicationFilter"
                className="application-filter"
                name="applicationFilter"
                label="Application Name"
                onChange={handleApplicationFilterChange}
                value={applicationFilter}
                disabled={isLoading}
            />
        </div>
    );

    return (
        <div className="cgp-availability-container">
            <div className="header-container">
                <h1 className="page-title" data-testid="title">
                    {'CGP Availability'}
                    <HelpText className="page-info" text="Data are displayed in PST time. Display the last 7 days availability for each application calculated monitoring the CGP logs as: (Total Requests - 5XX request) * 100) / Total Requests" />
                </h1>
                <Legend/>
            </div>
            {!kioskMode && renderFilters()}
            <LoadingContainer isLoading={isLoading} error={error}>
                <DataTable
                    data={filteredAvailability?.length && filteredAvailability || []}
                    columns={availability?.length ? extractColumns(availability, dateTimeFormat) : []}
                    columnHeaders={headers()}
                    sortByColumn = "Availability"
                    sortByDirection = "asc"
                    paginated
                    enableCSVDownload = {!kioskMode}
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
