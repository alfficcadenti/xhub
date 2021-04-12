import React, {useState, useEffect} from 'react';
import {withRouter} from 'react-router-dom';
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
import {getFilters, getFiltersForMultiKeys, startTime, endTime} from './impulseHandler';
import {Checkbox, Switch} from '@homeaway/react-form-components';
import {IncidentDetails} from './tabs/BookingTrends';
import AnomalyDetails from './tabs/BookingTrends/sections/AnomalyTable/AnomalyDetails';

const startDateDefaultValue = startTime;
const endDateDefaultValue = endTime;

const activeIndex = 0;
const navLinks = [
    {
        id: 'bookings',
        label: 'Booking Trends',
        href: '/impulse'
    }
];

const getNowDate = () => moment().endOf('minute').toDate();
const getLastDate = (value, unit) => moment().subtract(value, unit).startOf('minute').toDate();
const getValue = (value, unit) => ({start: getLastDate(value, unit), end: getNowDate()});
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
    const [startDateTime, setStartDateTime] = useState(startDateDefaultValue);
    const [endDateTime, setEndDateTime] = useState(endDateDefaultValue);
    const [isApplyClicked, setIsApplyClicked] = useState(false);
    const [allData, setFilterAllData] = useState([]);
    const [showMoreFilters, setShowMoreFilters] = useState(false);
    const [annotationsMulti, setAnnotationsMulti] = useState([]);
    const [selectedSiteURLMulti, setSelectedSiteURLMulti] = useState([]);
    const [selectedLobMulti, setSelectedLobMulti] = useState([]);
    const [selectedBrandMulti, setSelectedBrandMulti] = useState([]);
    const [selectedDeviceTypeMulti, setSelectedDeviceTypeMulti] = useState([]);
    const [selectedIncidentMulti, setSelectedIncidentMulti] = useState([]);
    const [enableIncidents, setEnableIncidents] = useState(true);
    const [chartSliced, setChartSliced] = useState(false);
    const [isAutoRefresh, setAutoRefresh] = useState(true);
    const [daysDifference, setDaysDifference] = useState(moment(endDateTime).diff(moment(startDateTime), 'days'));
    const [tableData, setTableData] = useState([]);
    const [anomaliesData, setAnomaliesData] = useState([]);
    const [enableAnomalies, setEnableAnomalies] = useState(true);
    const [selectedAnomaliesMulti, setSelectedAnomaliesMulti] = useState([]);
    const [anomalyTableData, setAnomalyTableData] = useState([]);

    useQueryParamChange(newBrand, props.onBrandChange);
    useSelectedBrand(newBrand, props.onBrandChange, props.prevSelectedBrand);
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
        anomalies] = useFetchBlipData(
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
        isAutoRefresh);
    const modifyFilters = (newValuesOnChange) => {
        setSelectedLobMulti([]);
        setSelectedDeviceTypeMulti([]);
        setSelectedSiteURLMulti([]);
        if (typeof newValuesOnChange !== 'undefined' && brandsFilterData !== null && newValuesOnChange.length > 0) {
            setLobsMulti(getFiltersForMultiKeys(newValuesOnChange, brandsFilterData, 'lob'));
            setDeviceTypesMulti(getFiltersForMultiKeys(newValuesOnChange, brandsFilterData, 'deviceType'));
            setEgSiteURLMulti(getFiltersForMultiKeys(newValuesOnChange, brandsFilterData, 'egSiteUrl'));
        } else {
            setLobsMulti(getFilters(filterData, 'lob'));
            setDeviceTypesMulti(getFilters(filterData, 'deviceType'));
            setEgSiteURLMulti(getFilters(filterData, 'egSiteUrl'));
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

        setAnnotationsMulti(annotations);
        filterAnnotationsOnBrand();

        setAnomaliesData(anomalies);
        filterAnomalies(selectedAnomaliesMulti);
    }, [res, annotations, anomalies]);
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
        setStartDateTime(moment(startDateTimeStr).utc());
        setEndDateTime(moment(endDateTimeStr).utc());
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
    const renderTabs = () => {
        switch (activeIndex) {
            case 0:
                return (<BookingTrends
                    data={allData}
                    setStartDateTime={setStartDateTime} setEndDateTime={setEndDateTime}
                    setChartSliced={setChartSliced}
                    annotations={enableIncidents ? annotationsMulti : []}
                    setDaysDifference={setDaysDifference}
                    daysDifference={daysDifference}
                    setTableData={setTableData}
                    anomalies={enableAnomalies ? anomaliesData : []}
                    setAnomalyTableData={setAnomalyTableData}
                />);
            default:
                return (<BookingTrends
                    data={allData}
                    setStartDateTime={setStartDateTime} setEndDateTime={setEndDateTime}
                    setChartSliced={setChartSliced}
                    annotations={enableIncidents ? annotationsMulti : []}
                    setDaysDifference={setDaysDifference}
                    daysDifference={daysDifference}
                />);
        }
    };
    const renderMultiSelectFilters = (value, options, key, placeholder, className) => {
        return (<div className={className}>
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
                    {!chartSliced && daysDifference === 3 && (moment().diff(moment(endDateTime), 'days') === 0) ? <div className="refresh-switch">
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
            <div className="impulse-filters-wrapper">
                <DatetimeRangePicker
                    onChange={handleDatetimeChange}
                    startDate={startDateTime.toDate()}
                    endDate={endDateTime.toDate()}
                    presets={getPresets()}
                />
                <div className="filter-option">
                    {renderMultiSelectFilters(selectedBrandMulti, brandsMulti, 'brand', ALL_BRANDS, filterSelectionClass)}
                    {renderMultiSelectFilters(selectedLobMulti, lobsMulti, 'lob', ALL_LOB, filterSelectionClass)}
                    {renderMultiSelectFilters(selectedSiteURLMulti, egSiteURLMulti, 'egSiteUrl', ALL_POS, filterExpandClass)}
                    <button
                        type="button"
                        className="apply-button btn btn-primary active"
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
                        onClick={handleShowMoreFilters}
                    >
                        <SVGIcon usefill markup={FILTER__16}/>{'Advance Filters'}
                    </button>
                    <Checkbox
                        name="incidents-сheckbox"
                        label="Booking Impacting INCs"
                        checked={enableIncidents}
                        onChange={handleEnableIncidentChange}
                        size="sm"
                        className="incidents-сheckbox"
                    />
                    <div className="filter-option" onClick={() => setShowMoreFilters(false)}>
                        {enableIncidents ? renderMultiSelectFilters(selectedIncidentMulti, incidentMulti, 'incidentCategory', ALL_INCIDENTS, filterSelectionClass) : null}
                    </div>
                    <Checkbox
                        name="Anomalies-сheckbox"
                        label="Anomalies"
                        checked={enableAnomalies}
                        onChange={handleEnableAnomalyChange}
                        size="sm"
                        className="incidents-сheckbox"
                    />
                    <div className="filter-option" onClick={() => setShowMoreFilters(false)}>
                        {enableAnomalies ? renderMultiSelectFilters(selectedAnomaliesMulti, anomaliesMulti, 'anomaliesCategory', ALL_ANOMALIES, filterSelectionClass) : null}
                    </div>
                </div>
            </div>
            {renderMoreFilters()}
            <Navigation
                noMobileSelect
                activeIndex={activeIndex}
                links={navLinks}
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
