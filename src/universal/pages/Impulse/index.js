/* eslint-disable complexity */
import React, {useState, useEffect} from 'react';
import {useLocation, withRouter} from 'react-router-dom';
import {useFetchBlipData} from './customHook';
import {Navigation} from '@homeaway/react-navigation';
import LoadingContainer from '../../components/LoadingContainer';
import {BookingTrends} from './tabs/BookingTrends';
import {useQueryParamChange, useSelectedBrand} from '../hooks';
import {DatetimeRangePicker} from '../../components/DatetimeRangePicker';
import Select from 'react-select';
import moment from 'moment/moment';
import {Divider} from '@homeaway/react-collapse';
import {SVGIcon} from '@homeaway/react-svg';
import {FILTER__16} from '@homeaway/svg-defs';
import './styles.less';
import {ALL_LOB, ALL_POS, ALL_BRANDS, ALL_DEVICES, ALL_INCIDENTS, ALL_ANOMALIES} from '../../constants';
import {getFilters, getFiltersForMultiKeys, getQueryValues, useAddToUrl, getTimeIntervals, isValidTimeInterval, getDefaultTimeInterval, getActiveIndex} from './impulseHandler';
import {Checkbox, Switch} from '@homeaway/react-form-components';
import {IncidentDetails} from './tabs/BookingTrends';
import AnomalyDetails from './tabs/BookingTrends/sections/AnomalyTable/AnomalyDetails';
import BookingsDataTable from './tabs/BookingTrends/sections/BookingChart/BookingsDataTable';
import {getValue} from '../utils';
import {Dropdown, DropdownItem} from '@homeaway/react-dropdown';
import GroupedBookingTrends from './tabs/BookingTrends/sections/BookingChartGrouped/GroupedBookingTrends';

const navLinks = [
    {
        id: 'bookings',
        label: 'Booking Trends',
        href: '/impulse'
    },
    {
        id: 'by_brands',
        label: 'By Brands',
        href: '/impulse'
    },
    {
        id: 'by_lobs',
        label: 'By LOBs',
        href: '/impulse'
    },
    {
        id: 'bookings-data',
        label: 'Bookings Data',
        href: '/impulse'
    }
];

const getPresets = () => [
    {text: 'Last 5 Minutes', value: getValue(6, 'minute')},
    {text: 'Last 15 Minutes', value: getValue(15, 'minute')},
    {text: 'Last 60 Minutes', value: getValue(60, 'minute')},
    {text: 'Last 24 Hours', value: getValue(23.98, 'hours')},

];

const filterSelectionClass = 'filter-option-selection';
const filterExpandClass = 'filter-option-expand';
let filteredAnnotationsOnBrand = [];
const healthUrl = 'https://opexhub-grafana.expedia.biz/d/x8JcATVMk/opex-impulse?viewPanel=42&orgId=1&from=now-3d&to=now';

const Impulse = (props) => {
    const newBrand = props.selectedBrands[0];
    const {pathname, search} = useLocation();
    const {
        initialStart,
        initialEnd,
        initialInterval,
        initialAutoRefresh,
        initialBrands,
        initialLobs,
        initialEgSiteUrls,
        initialDevices,
        initialIncidents,
        initialAnomalies
    } = getQueryValues(search);

    const [startDateTime, setStartDateTime] = useState(initialStart);
    const [endDateTime, setEndDateTime] = useState(initialEnd);
    const [isApplyClicked, setIsApplyClicked] = useState(false);
    const [isResetClicked, setIsResetClicked] = useState(false);
    const [allData, setFilterAllData] = useState([]);
    const [showMoreFilters, setShowMoreFilters] = useState(initialDevices.length > 0);
    const [annotationsMulti, setAnnotationsMulti] = useState([]);
    const [selectedSiteURLMulti, setSelectedSiteURLMulti] = useState(initialEgSiteUrls);
    const [selectedLobMulti, setSelectedLobMulti] = useState(initialLobs);
    const [selectedBrandMulti, setSelectedBrandMulti] = useState(initialBrands);
    const [selectedDeviceTypeMulti, setSelectedDeviceTypeMulti] = useState(initialDevices);
    const [selectedIncidentMulti, setSelectedIncidentMulti] = useState(initialIncidents);
    const [enableIncidents, setEnableIncidents] = useState(true);
    const [chartSliced, setChartSliced] = useState(false);
    const [isAutoRefresh, setAutoRefresh] = useState(initialAutoRefresh);
    const [daysDifference, setDaysDifference] = useState(moment(endDateTime).diff(moment(startDateTime), 'days'));
    const [tableData, setTableData] = useState([]);
    const [anomaliesData, setAnomaliesData] = useState([]);
    const [enableAnomalies, setEnableAnomalies] = useState(true);
    const [selectedAnomaliesMulti, setSelectedAnomaliesMulti] = useState(initialAnomalies);
    const [anomalyTableData, setAnomalyTableData] = useState([]);
    const [timeInterval, setTimeInterval] = useState(initialInterval);
    const [timeIntervalOpts, setTimeIntervalOpts] = useState(getTimeIntervals(startDateTime, endDateTime, timeInterval));

    const [activeIndex, setActiveIndex] = useState(getActiveIndex(pathname));
    const [allDataByBrands, setAllDataByBrand] = useState([]);
    const [allDataByLobs, setAllDataByLobs] = useState([]);

    useQueryParamChange(newBrand, props.onBrandChange);
    useSelectedBrand(newBrand, props.onBrandChange, props.prevSelectedBrand);
    const handleNavigationClick = (e, activeLinkIndex) => {
        setActiveIndex(activeLinkIndex);
    };
    const [isLoading,
        res,
        error,
        egSiteURLMulti,
        setEgSiteURLMulti,
        lobsMulti,
        setLobsMulti,
        brandsMulti,
        deviceTypesMulti,
        setDeviceTypesMulti,
        incidentMulti,
        filterData,
        brandsFilterData,
        annotations,
        isLatencyHealthy,
        sourceLatency,
        anomaliesMulti,
        anomalies,
        groupedResByBrands,
        groupedResByLobs] = useFetchBlipData(
        isApplyClicked,
        setIsApplyClicked,
        startDateTime,
        endDateTime,
        newBrand,
        props.prevSelectedBrand,
        selectedSiteURLMulti,
        selectedLobMulti,
        selectedBrandMulti,
        selectedDeviceTypeMulti,
        chartSliced,
        setChartSliced,
        isAutoRefresh,
        setAutoRefresh,
        setStartDateTime,
        setEndDateTime,
        timeInterval,
        isResetClicked,
        setIsResetClicked);

    const modifyFilters = (newValuesOnChange) => {
        setSelectedLobMulti([]);
        setSelectedDeviceTypeMulti([]);
        setSelectedSiteURLMulti([]);
        if (typeof newValuesOnChange !== 'undefined' && brandsFilterData !== null && newValuesOnChange.length > 0) {
            setLobsMulti(getFiltersForMultiKeys(newValuesOnChange, brandsFilterData, 'lobs'));
            setDeviceTypesMulti(getFiltersForMultiKeys(newValuesOnChange, brandsFilterData, 'device_types'));
            setEgSiteURLMulti(getFiltersForMultiKeys(newValuesOnChange, brandsFilterData, 'point_of_sales'));
        } else {
            setLobsMulti(getFilters(filterData, 'lobs'));
            setDeviceTypesMulti(getFilters(filterData, 'device_types'));
            setEgSiteURLMulti(getFilters(filterData, 'point_of_sales'));
        }
    };
    const filterAnnotations = (newValuesOnChange) => {
        if (typeof newValuesOnChange !== 'undefined' && newValuesOnChange !== null && newValuesOnChange.length > 0) {
            if (selectedBrandMulti.length > 0) {
                const filteredAnnotations = filteredAnnotationsOnBrand.filter((annotation) => newValuesOnChange.includes(annotation.priority));
                setAnnotationsMulti(filteredAnnotations);
            } else {
                const filteredAnnotations = annotations.filter((annotation) => newValuesOnChange.includes(annotation.priority));
                setAnnotationsMulti(filteredAnnotations);
            }
        } else if (selectedBrandMulti.length > 0) {
            setAnnotationsMulti(filteredAnnotationsOnBrand);
        } else {
            setAnnotationsMulti(annotations);
        }
    };

    const filterAnomalies = (newValuesOnChange) => {
        if (typeof newValuesOnChange !== 'undefined' && newValuesOnChange !== null && newValuesOnChange.length > 0) {
            const filteredAnomalies = anomalies.filter((anomaly) => newValuesOnChange.includes(anomaly.category));
            setAnomaliesData(filteredAnomalies);
        } else {
            setAnomaliesData(anomalies);
        }
    };

    const filterAnnotationsOnBrand = () => {
        if (selectedBrandMulti.length > 0) {
            filteredAnnotationsOnBrand = annotations.filter((annotation) => {
                let estimatedImpact = annotation.estimatedImpact;
                let impactedBrands = estimatedImpact.map((estimatedImpactObj) => estimatedImpactObj.brand);
                if (impactedBrands.includes(null)) {
                    return true;
                }
                let toShowIncident = false;
                toShowIncident = selectedBrandMulti.some((selectedBrand) => {
                    return impactedBrands.includes(selectedBrand);
                });
                return toShowIncident;
            });
            if (typeof selectedIncidentMulti !== 'undefined' && selectedIncidentMulti !== null && selectedIncidentMulti.length > 0) {
                const filteredAnnotations = filteredAnnotationsOnBrand.filter((annotation) => selectedIncidentMulti.includes(annotation.priority));
                setAnnotationsMulti(filteredAnnotations);
            } else {
                setAnnotationsMulti(filteredAnnotationsOnBrand);
            }
        } else if (typeof selectedIncidentMulti !== 'undefined' && selectedIncidentMulti !== null && selectedIncidentMulti.length > 0) {
            const filteredAnnotations = annotations.filter((annotation) => selectedIncidentMulti.includes(annotation.priority));
            setAnnotationsMulti(filteredAnnotations);
        } else {
            setAnnotationsMulti(annotations);
        }
    };
    const handleMultiChange = (event, handler) => {
        const newValuesOnChange = (event || []).map((item) => item.value);
        if (handler === 'lob') {
            setSelectedLobMulti(newValuesOnChange);
        } else if (handler === 'brand') {
            modifyFilters(newValuesOnChange);
            setSelectedBrandMulti(newValuesOnChange);
        } else if (handler === 'deviceType') {
            setSelectedDeviceTypeMulti(newValuesOnChange);
        } else if (handler === 'egSiteUrl') {
            setSelectedSiteURLMulti(newValuesOnChange);
        } else if (handler === 'incidentCategory') {
            filterAnnotations(newValuesOnChange);
            setSelectedIncidentMulti(newValuesOnChange);
        } else if (handler === 'anomaliesCategory') {
            filterAnomalies(newValuesOnChange);
            setSelectedAnomaliesMulti(newValuesOnChange);
        }
    };
    useEffect(() => {
        setFilterAllData([...res]);

        setAllDataByBrand([...groupedResByBrands]);
        setAllDataByLobs([...groupedResByLobs]);

        setAnnotationsMulti(annotations);
        filterAnnotationsOnBrand();

        setAnomaliesData(anomalies);
        filterAnomalies(selectedAnomaliesMulti);
    }, [res, annotations, anomalies, groupedResByBrands, groupedResByLobs]);
    const customStyles = {
        control: (base) => ({
            ...base,
            'min-height': '55px',
            'border-color': '#908f8f',
            'color': '#717171',
            'border-radius': '8px'
        }),
    };
    const handleDatetimeChange = ({start: startDateTimeStr, end: endDateTimeStr}) => {
        const newStart = moment(startDateTimeStr).utc();
        const newEnd = moment(endDateTimeStr).utc();
        setStartDateTime(newStart);
        setEndDateTime(newEnd);
        if (!isValidTimeInterval(newStart, newEnd, timeInterval)) {
            const newInterval = getDefaultTimeInterval(newStart, newEnd);
            setTimeInterval(newInterval);
            setTimeIntervalOpts(getTimeIntervals(newStart, newEnd, newInterval));
        } else {
            setTimeIntervalOpts(getTimeIntervals(newStart, newEnd, timeInterval));
        }
    };
    const handleShowMoreFilters = () => {
        setShowMoreFilters(!showMoreFilters);
    };
    const handleEnableIncidentChange = () => {
        setEnableIncidents(!enableIncidents);
        setSelectedIncidentMulti([]);
        if (selectedBrandMulti.length > 0) {
            setAnnotationsMulti(filteredAnnotationsOnBrand);
        } else {
            setAnnotationsMulti(annotations);
        }
    };
    const handleEnableAnomalyChange = () => {
        setEnableAnomalies(!enableAnomalies);
        setSelectedAnomaliesMulti([]);
        setAnomaliesData(anomalies);
    };
    const handleTimeIntervalChange = (timeIntervalStr) => {
        setTimeInterval(timeIntervalStr);
        setTimeIntervalOpts(getTimeIntervals(startDateTime, endDateTime, timeIntervalStr));
    };

    useAddToUrl(newBrand, startDateTime, endDateTime, timeInterval, isAutoRefresh, selectedLobMulti, selectedBrandMulti, selectedSiteURLMulti, selectedDeviceTypeMulti, selectedIncidentMulti, selectedAnomaliesMulti, activeIndex);

    const renderTabs = () => {
        switch (activeIndex) {
            case 0:
                return (<BookingTrends
                    data={allData}
                    setStartDateTime={setStartDateTime} setEndDateTime={setEndDateTime}
                    setChartSliced={setChartSliced}
                    setIsResetClicked={setIsResetClicked}
                    annotations={enableIncidents ? annotationsMulti : []}
                    setDaysDifference={setDaysDifference}
                    daysDifference={daysDifference}
                    setTableData={setTableData}
                    anomalies={enableAnomalies ? anomaliesData : []}
                    setAnomalyTableData={setAnomalyTableData}
                    timeInterval={timeInterval}
                    setTimeInterval={setTimeInterval}
                    setTimeIntervalOpts={setTimeIntervalOpts}
                />);
            case 1:
                return (<GroupedBookingTrends
                    data={allDataByBrands}
                    setStartDateTime={setStartDateTime} setEndDateTime={setEndDateTime}
                    setIsResetClicked={setIsResetClicked}
                    setChartSliced={setChartSliced}
                    setDaysDifference={setDaysDifference}
                    daysDifference={daysDifference}
                    annotations={enableIncidents ? annotationsMulti : []}
                    setTableData={setTableData}
                    anomalies={enableAnomalies ? anomaliesData : []}
                    setAnomalyTableData={setAnomalyTableData}
                    timeInterval={timeInterval}
                    setTimeInterval={setTimeInterval}
                    setTimeIntervalOpts={setTimeIntervalOpts}
                    activeIndex={activeIndex}
                />);
            case 2:
                return (<GroupedBookingTrends
                    data={allDataByLobs}
                    setStartDateTime={setStartDateTime} setEndDateTime={setEndDateTime}
                    setIsResetClicked={setIsResetClicked}
                    setChartSliced={setChartSliced}
                    setDaysDifference={setDaysDifference}
                    daysDifference={daysDifference}
                    annotations={enableIncidents ? annotationsMulti : []}
                    setTableData={setTableData}
                    anomalies={enableAnomalies ? anomaliesData : []}
                    setAnomalyTableData={setAnomalyTableData}
                    timeInterval={timeInterval}
                    setTimeInterval={setTimeInterval}
                    setTimeIntervalOpts={setTimeIntervalOpts}
                    activeIndex={activeIndex}
                />);
            case 3:
                return (<BookingsDataTable
                    data={allData}
                />);
            default:
                return (<BookingTrends
                    data={allData}
                    setStartDateTime={setStartDateTime} setEndDateTime={setEndDateTime}
                    setChartSliced={setChartSliced}
                    annotations={enableIncidents ? annotationsMulti : []}
                    setDaysDifference={setDaysDifference}
                    daysDifference={daysDifference}
                    timeInterval={timeInterval}
                    setTimeInterval={setTimeInterval}
                    setTimeIntervalOpts={setTimeIntervalOpts}
                />);
        }
    };
    const renderTimeInterval = (interval, presets, onChange) => (
        <div className="time-interval" title="Time interval dropdown selector">
            <Dropdown
                id="time-interval-dropdown"
                label={interval ? interval : 'Time Interval'}
                className="time-interval-dropdown"
                closeAfterContentClick
            >
                {presets.map((d) => (
                    <DropdownItem
                        key={d}
                        link="#"
                        text={d}
                        onClick={() => onChange(d)}
                    />
                ))}
            </Dropdown>
        </div>
    );
    const renderMultiSelectFilters = (value, options, key, placeholder, className) => {
        return (<div className={className} title={`Multi select ${key} from dropdown`}>
            <Select
                isMulti
                styles={customStyles}
                value={value.map((v) => ({value: v, label: v}))}
                options={options}
                onChange={(e) => handleMultiChange(e, key)}
                placeholder={placeholder}
            />
        </div>);
    };
    const renderMoreFilters = () => (
        <Divider heading={'Advance filters for Impulse'} id="advance-filters-divider" className="more-filters-divider" expanded={showMoreFilters}>
            <form className="search-form search-form__more">
                <div className="filter-option">
                    {renderMultiSelectFilters(selectedDeviceTypeMulti, deviceTypesMulti, 'deviceType', ALL_DEVICES, filterSelectionClass)}
                </div>
            </form>
        </Divider>
    );
    const renderHealthCheck = () => (
        <a href = {healthUrl} target={'_blank'}>
            <div className = "health-check"
                style = {{color: isLatencyHealthy ? '#080' : '#b22'}}
            >
                {'TP99: '}{sourceLatency ? `${sourceLatency}s` : 'NA'}
                <span className="health-desc-tooltip">
                    <div className="health-desc">Performance Indicator (Data Ingestion)</div>
                    <div className="healthy-desc">Latency is between 3 to 60 sec</div>
                    <div className="unhealthy-desc">Latency is above 60 sec or no data</div>
                </span>
            </div></a>
    );

    return (
        <div className="impulse-container">
            <div className="heading-container">
                <h1 className="page-title">{'Impulse Dashboard'}</h1>
                <div className="right-header">
                    {sourceLatency || sourceLatency === 0 ? renderHealthCheck() : ''}
                    {(((moment(endDateTime).diff(moment(startDateTime), 'days') <= 5)) && (moment().diff(moment(endDateTime), 'hours') <= 0)) ? <div className="refresh-switch" title="Auto refresh charts toggle switch">
                        <Switch
                            id="switch-example-small"
                            name="autoRefresh"
                            label="Auto Refresh"
                            checked={isAutoRefresh}
                            onChange={() => setAutoRefresh(!isAutoRefresh)}
                            size="sm"
                        />
                    </div> : ''}
                </div>
            </div>
            <div className="impulse-filters-wrapper" title="Date time range selector">
                <DatetimeRangePicker
                    onChange={handleDatetimeChange}
                    startDate={startDateTime.toDate()}
                    endDate={endDateTime.toDate()}
                    presets={getPresets()}
                    showTimePicker
                />
                <div className="filter-option">
                    {renderTimeInterval(timeInterval, timeIntervalOpts, handleTimeIntervalChange)}
                    {renderMultiSelectFilters(selectedBrandMulti, brandsMulti, 'brand', ALL_BRANDS, filterSelectionClass)}
                    {renderMultiSelectFilters(selectedLobMulti, lobsMulti, 'lob', ALL_LOB, filterSelectionClass)}
                    {renderMultiSelectFilters(selectedSiteURLMulti, egSiteURLMulti, 'egSiteUrl', ALL_POS, filterExpandClass)}
                    <button
                        type="button"
                        className="apply-button btn btn-primary active"
                        title="Click on Submit to apply changes"
                        onClick={() => {
                            setIsApplyClicked(true);
                            setDaysDifference(moment(endDateTime).diff(moment(startDateTime), 'days'));
                            setTableData([]);
                        }}
                    >
                        {'Submit'}
                    </button>
                </div>
                <div className="advance-filters-block">
                    <button
                        type="button"
                        className={`btn btn-default more-filters-btn ${showMoreFilters ? 'active' : ''}`}
                        title="Click to expand and see more filters"
                        onClick={handleShowMoreFilters}
                    >
                        <SVGIcon usefill markup={FILTER__16}/>{'Advance Filters'}
                    </button>
                    <div className="filter-option" title="Toggle checkbox to enable/ disable incidents category selector" onClick={() => setShowMoreFilters(false)}>
                        <Checkbox
                            name="incidents-сheckbox"
                            label="Booking Impacting INCs"
                            checked={enableIncidents}
                            onChange={handleEnableIncidentChange}
                            size="sm"
                            className="incidents-сheckbox"
                        />
                        {enableIncidents ? renderMultiSelectFilters(selectedIncidentMulti, incidentMulti, 'incidentCategory', ALL_INCIDENTS, filterSelectionClass) : null}
                    </div>
                    <div className="filter-option" title="Toggle checkbox to enable/ disable anomalies category selector" onClick={() => setShowMoreFilters(false)}>
                        <Checkbox
                            name="Anomalies-сheckbox"
                            label="Anomalies"
                            checked={enableAnomalies}
                            onChange={handleEnableAnomalyChange}
                            size="sm"
                            className="incidents-сheckbox"
                        />
                        {enableAnomalies ? renderMultiSelectFilters(selectedAnomaliesMulti, anomaliesMulti, 'anomaliesCategory', ALL_ANOMALIES, filterSelectionClass) : null}
                    </div>
                </div>
            </div>
            {renderMoreFilters()}
            <Navigation
                noMobileSelect
                activeIndex={activeIndex}
                links={navLinks}
                onLinkClick={handleNavigationClick}
            />
            <LoadingContainer isLoading={isLoading} error={error} className="impulse-loading-container">
                <div className="impulse-chart-container">
                    <div className="impulse-bookings-container">
                        {renderTabs()}
                        { (tableData.length !== 0) && <IncidentDetails data={tableData} setTableData={setTableData}/> }
                        { (anomalyTableData.length !== 0) && <AnomalyDetails data={anomalyTableData} setAnomalyTableData={setAnomalyTableData}/>}
                    </div>
                </div>
            </LoadingContainer>
        </div>
    );
};

export default withRouter(Impulse);
