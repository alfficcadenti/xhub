import React, {useEffect, useState} from 'react';
import {useHistory, useLocation, withRouter} from 'react-router-dom';
import LoadingContainer from '../../components/LoadingContainer';
import HelpText from '../../components/HelpText/HelpText';
import {checkResponse} from '../utils';
import DataTable from '../../components/DataTable';
import moment from 'moment';
import {
    extractColumns,
    getAvailabilityRows,
    getAppErrorsDataForChart,
    mapAvailabilityRow,
    getSelectedBrandForApi,
    getSelectedRegions,
    getPresets,
    getQueryValues,
    getTotalAvailabilityOverTime,
    getTotalStats
} from './utils';
import ErrorCountModal from './ErrorCountModal';
import OverallAvailabilityModal from './OverallAvailabilityModal';
import Legend from './Legend';
import Overall from './Overall';
import {FormInput} from '@homeaway/react-form-components';
import MultiSelect from '@homeaway/react-multiselect-dropdown';
import Tooltip from '@homeaway/react-tooltip';
import './styles.less';
import {DatetimeRangePicker} from '../../components/DatetimeRangePicker';
import {DATE_FORMAT, DATETIME_FORMAT, API_UTC_FORMAT, REGIONS, TIERS} from './constants';

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

const serviceTier = [{
    name: 'all',
    label: 'All',
    checked: true,
    counted: false
}].concat(TIERS.map((r) => ({
    name: r,
    label: r,
    checked: true,
    nested: true
})));


const CGPAvailibility = ({selectedBrands}) => {
    const history = useHistory();
    const {pathname} = useLocation();

    const {search} = useLocation();
    const {kioskMode} = getQueryValues(search);
    const [availability, setAvailability] = useState([]);
    const [filteredAvailability, setFilteredAvailability] = useState(availability);
    const [totalAvailabilityOverTime, setTotalAvailabilityOverTime] = useState(getTotalAvailabilityOverTime(filteredAvailability));
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedApp, setSelectedApp] = useState(null);
    const [availabilityFilter, setAvailabilityFilter] = useState(100.00);
    const [totalRequests, setTotalRequests] = useState('');
    const [totalErrors, setTotalErrors] = useState('');
    const [applicationFilter, setApplicationFilter] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [pendingRegionFilter, setPendingRegionFilter] = useState(regions);
    const [serviceTierFilter, setServiceTierFilter] = useState(serviceTier);
    const [selectedRegionFilter, setSelectedRegionFilter] = useState(pendingRegionFilter);
    const [isDirtyForm, setIsDirtyForm] = useState(false);
    const [isOverallModalOpen, setIsOverallModalOpen] = useState(false);
    const [regionErrorMsg, setRegionErrorMsg] = useState('');
    const [serviceTierErrorMsg, setServiceTierErrorMsg] = useState('');
    const [start, setStart] = useState(kioskMode ? moment().utc().subtract(59, 'minutes') : moment().utc().subtract(7, 'days'));
    const [end, setEnd] = useState(moment().utc());
    const [pendingStart, setPendingStart] = useState(start);
    const [pendingEnd, setPendingEnd] = useState(end);
    const [dateTimeFormat, setDateTimeFormat] = useState(DATE_FORMAT);

    useEffect(() => {
        const getNewData = () => {
            setIsLoading(true);
            setError('');
            const apiBrand = getSelectedBrandForApi(selectedBrands) ? `&filters={"filterName":"brand","filterValues":${getSelectedBrandForApi(selectedBrands)}}` : '';
            const url = `${'/v2/application-availability/filters'
                + `?from_date=${start.utc().format(API_UTC_FORMAT)}`
                + `&to_date=${end.utc().format(API_UTC_FORMAT)}`
                + `&filters={"filterName":"aws_region","filterValues":${getSelectedRegions(selectedRegionFilter)}}`}${
                apiBrand}`;
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
            history.push(`${pathname}?selectedBrand=${selectedBrands}`);
        };
        getNewData();

        if (end.diff(start, 'days') >= 1) {
            setDateTimeFormat(DATE_FORMAT);
        } else {
            setDateTimeFormat(DATETIME_FORMAT);
        }
    }, [selectedBrands, selectedRegionFilter, start, end, history, pathname]);

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
            .filter((x) => typeof x.avgValue === 'number' && x.avgValue <= availabilityFilter && x.app.includes(applicationFilter) && serviceTierFilter.find((item) => item.checked && item.label === x.serviceTier));
        setFilteredAvailability(newFilteredAvailability);
        setTotalAvailabilityOverTime(getTotalAvailabilityOverTime(newFilteredAvailability));
        const totalStats = getTotalStats(newFilteredAvailability);
        setTotalRequests(totalStats.totalRequests);
        setTotalErrors(totalStats.totalErrors);
    }, [availabilityFilter, applicationFilter, serviceTierFilter, availability, dateTimeFormat]);

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

    const handleServiceTierChange = (e) => {
        if (e.items.filter((x) => x.checked === true).length === 0) {
            setServiceTierErrorMsg('Field required. Choose at least one tier');
            return;
        }
        setServiceTierErrorMsg('');
        setServiceTierFilter(e.items);
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

    const handleHeaderClick = (timestamp) => {
        const newStart = moment(timestamp);
        const newEnd = dateTimeFormat === DATE_FORMAT
            ? newStart.clone().add(23, 'hours').minutes(59).seconds(59)
            : newStart.clone().minutes(59, 'minutes').seconds(59);
        setPendingStart(newStart);
        setPendingEnd(newEnd);
        setStart(newStart.clone());
        setEnd(newEnd.clone());
    };

    const handleOverallClick = () => setIsOverallModalOpen(true);

    const handleOverallOnClose = () => setIsOverallModalOpen(false);

    const headers = () => {
        const enableHeaderClick = end.diff(start, 'hours') >= 1;
        return getAvailabilityRows(availability, dateTimeFormat, handleHeaderClick, enableHeaderClick);
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
            <MultiSelect
                id="serviceTierSelect"
                className="service-tier-select"
                label="Service Tier"
                items={serviceTierFilter}
                onChange={handleServiceTierChange}
                errorMsg={serviceTierErrorMsg}
                disabled={isLoading}
            />
        </div>
    );

    return (
        <div className="cgp-availability-container">
            <div className="header-container">
                <h1 className="page-title" data-testid="title">
                    {'CGP Availability'}
                    <HelpText className="page-info" text="Daily rollups are bucketed 12:00AM to 11:59PM PST time. Availability is calculated with the following formula: (Total Requests - 5XX request) * 100) / Total Requests" />
                </h1>
                <Overall
                    totalErrors={totalErrors}
                    totalRequests={totalRequests}
                    onClickHandler={handleOverallClick}
                />
                <Legend/>
            </div>
            {!kioskMode && renderFilters()}
            <LoadingContainer isLoading={isLoading} error={error}>
                <DataTable
                    data={filteredAvailability}
                    columns={extractColumns(availability, dateTimeFormat)}
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
                    data={selectedApp && getAppErrorsDataForChart(selectedApp, availability, dateTimeFormat)}
                />
                <OverallAvailabilityModal
                    isOpen={isOverallModalOpen}
                    onClose={handleOverallOnClose}
                    data={totalAvailabilityOverTime}
                    dateTimeFormat={dateTimeFormat}
                />
            </LoadingContainer>
        </div>
    );
};

export default withRouter(CGPAvailibility);
