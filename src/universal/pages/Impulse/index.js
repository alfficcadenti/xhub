import React, {useState, useEffect} from 'react';
import {useFetchBlipData} from './customHook';
import {Navigation} from '@homeaway/react-navigation';
import LoadingContainer from '../../components/LoadingContainer';
import {BookingTrends} from './tabs/index';
import {useQueryParamChange, useSelectedBrand} from '../hooks';
import {DatetimeRangePicker} from '../../components/DatetimeRangePicker';
import Select from 'react-select';
import moment from 'moment/moment';
import {Divider} from '@homeaway/react-collapse';
import {SVGIcon} from '@homeaway/react-svg';
import {FILTER__16} from '@homeaway/svg-defs';
import './styles.less';
import {ALL_LOB, ALL_POS, ALL_BRANDS, ALL_DEVICES, ALL_INCIDENTS} from '../../constants';
import {getFilters, getFiltersForMultiKeys, startTime, endTime} from './impulseHandler';
import {Checkbox, Switch} from '@homeaway/react-form-components';

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
        annotations] = useFetchBlipData(
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
        if (typeof newValuesOnChange !== 'undefined' && newValuesOnChange !== null && newValuesOnChange.length > 0 && !newValuesOnChange.includes('All')) {
            const filteredAnnotations = annotations.filter((annotation) => newValuesOnChange.includes(annotation.priority));
            setAnnotationsMulti(filteredAnnotations);
        } else {
            setAnnotationsMulti(annotations);
        }
    };
    // eslint-disable-next-line complexity
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
        }
    };
    useEffect(() => {
        setFilterAllData([...res]);
        setAnnotationsMulti(annotations);
        filterAnnotations(selectedIncidentMulti);
    }, [res, annotations]);
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
        setAnnotationsMulti(annotations);
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
    return (
        <div className="impulse-container">
            <div className="heading-container">
                <h1 className="page-title">{'Impulse Dashboard'}</h1>
                {!chartSliced && daysDifference === 3 ? <div className="refresh-switch">
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
                    </div>
                </div>
            </LoadingContainer>
        </div>
    );
};

export default Impulse;
