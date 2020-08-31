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

const startDateDefaultValue = moment().utc().subtract(3, 'days').startOf('minute');
const endDateDefaultValue = moment().utc().add(17, 'hours').endOf('minute');

const activeIndex = 0;
const navLinks = [
    {
        id: 'bookings',
        label: 'Booking Trends',
        href: '/impulse'
    }
];
import {ALL_LOB, ALL_POS, ALL_SITE_ID, ALL_TPID, ALL_BRANDS, ALL_DEVICES, ALL_BOOKING_TYPES} from '../../constants';

const filterSelectionClass = 'filter-option-selection';
const filterExpandClass = 'filter-option-expand';

const Impulse = (props) => {
    const newBrand = props.selectedBrands[0];
    const [startDateTime, setStartDateTime] = useState(startDateDefaultValue);
    const [endDateTime, setEndDDateTime] = useState(endDateDefaultValue);
    const [isApplyClicked, setIsApplyClicked] = useState(false);
    const [allData, setFilterAllData] = useState([]);
    const [showMoreFilters, setShowMoreFilters] = useState(false);
    const [selectedSiteURLMulti, setSelectedSiteURLMulti] = useState([]);
    const [selectedLobMulti, setSelectedLobMulti] = useState([]);
    const [selectedBrandMulti, setSelectedBrandMulti] = useState([]);
    const [selectedDeviceTypeMulti, setSelectedDeviceTypeMulti] = useState([]);
    const [selectedBookingTypeMulti, setSelectedBookingTypeMulti] = useState([]);
    const [selectedSiteId, setSelectedSiteId] = useState([]);
    const [selectedTPID, setSelectedTPID] = useState([]);

    useQueryParamChange(newBrand, props.onBrandChange);
    useSelectedBrand(newBrand, props.onBrandChange, props.prevSelectedBrand);
    const [isLoading, res, error, egSiteURLMulti, lobsMulti, brandsMulti, deviceTypesMulti, bookingTypesMulti, siteIds, TPIDs] = useFetchBlipData(isApplyClicked, setIsApplyClicked, startDateTime, endDateTime, newBrand, props.prevSelectedBrand, selectedSiteURLMulti, selectedLobMulti, selectedBrandMulti, selectedDeviceTypeMulti, selectedBookingTypeMulti, selectedSiteId, selectedTPID);
    // eslint-disable-next-line complexity
    const handleMultiChange = (event, handler) => {
        const newValuesOnChange = (event || []).map((item) => item.value);
        if (handler === 'lob') {
            setSelectedLobMulti(newValuesOnChange);
        } else if (handler === 'brand') {
            setSelectedBrandMulti(newValuesOnChange);
        } else if (handler === 'deviceType') {
            setSelectedDeviceTypeMulti(newValuesOnChange);
        } else if (handler === 'bookingType') {
            setSelectedBookingTypeMulti(newValuesOnChange);
        } else if (handler === 'egSiteUrl') {
            setSelectedSiteURLMulti(newValuesOnChange);
        } else if (handler === 'siteId') {
            setSelectedSiteId(newValuesOnChange);
        } else if (handler === 'tpid') {
            setSelectedTPID(newValuesOnChange);
        }
    };
    useEffect(() => {
        setFilterAllData([...res]);
    }, [res]);
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
        setEndDDateTime(moment(endDateTimeStr).utc());
    };
    const handleShowMoreFilters = () => {
        setShowMoreFilters(!showMoreFilters);
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
                    {renderMultiSelectFilters(selectedSiteURLMulti, egSiteURLMulti, 'egSiteUrl', ALL_POS, filterExpandClass)}
                    {renderMultiSelectFilters(selectedSiteId, siteIds, 'siteId', ALL_SITE_ID, filterExpandClass)}
                    {renderMultiSelectFilters(selectedTPID, TPIDs, 'tpid', ALL_TPID, filterExpandClass)}
                </div>
            </form>
        </Divider>
    );
    const renderTabs = () => {
        switch (activeIndex) {
            case 0:
                return <BookingTrends data={allData}/>;
            default:
                return <BookingTrends data={allData}/>;
        }
    };
    return (
        <div className="impulse-container">
            <div>
                <h1 className="page-title">{'Impulse Dashboard'}</h1>
            </div>
            <div className="impulse-filters-wrapper">
                <DatetimeRangePicker
                    onChange={handleDatetimeChange}
                    startDate={startDateTime.toDate()}
                    endDate={endDateTime.toDate()}
                />
                <div className="filter-option">
                    {renderMultiSelectFilters(selectedBrandMulti, brandsMulti, 'brand', ALL_BRANDS, filterSelectionClass)}
                    {renderMultiSelectFilters(selectedLobMulti, lobsMulti, 'lob', ALL_LOB, filterSelectionClass)}
                    {renderMultiSelectFilters(selectedDeviceTypeMulti, deviceTypesMulti, 'deviceType', ALL_DEVICES, filterSelectionClass)}
                    {renderMultiSelectFilters(selectedBookingTypeMulti, bookingTypesMulti, 'bookingType', ALL_BOOKING_TYPES, filterSelectionClass)}
                    <button
                        type="button"
                        className="apply-button btn btn-primary active"
                        onClick={() => {
                            setIsApplyClicked(true);
                        }}
                    >
                        {'Submit'}
                    </button>
                </div>

                <button
                    type="button"
                    className={`btn btn-default more-filters-btn ${showMoreFilters ? 'active' : ''}`}
                    onClick={handleShowMoreFilters}
                >
                    <SVGIcon usefill markup={FILTER__16}/>{' Advance Filters'}
                </button>
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
