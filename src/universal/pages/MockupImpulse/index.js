import React, {useState, useCallback, useEffect} from 'react';
import {useFetchBlipData} from './customHook';
import {Navigation} from '@homeaway/react-navigation';
import LoadingContainer from '../../components/LoadingContainer';
import FilterDropDown from '../../components/FilterDropDown';
import {BookingTrends} from './tabs/index';
import {useQueryParamChange, useSelectedBrand} from '../hooks';
import {DatetimeRangePicker} from '../../components/DatetimeRangePicker';
import moment from 'moment/moment';
import {
    ALL_LOB,
    ALL_BRANDS,
    ALL_DEVICE_TYPES,
    ALL_BOOKING_TYPES,
    ALL_EG_SITE_URL
} from '../../constants';
import './styles.less';

const startDateDefaultValue = moment().utc().subtract(3, 'days').startOf('minute');
const endDateDefaultValue = moment().utc().add(17, 'hours').endOf('minute');

const activeIndex = 0;
const navLinks = [
    {
        id: 'actualvsprediction',
        label: 'Booking Trends',
        href: '/impulse'
    }
];

const Impulse = (props) => {
    const newBrand = props.selectedBrands[0];
    const [startDateTime, setStartDateTime] = useState(startDateDefaultValue);
    const [endDateTime, setEndDDateTime] = useState(endDateDefaultValue);
    const [isApplyClicked, setIsApplyClicked] = useState(false);
    const [allData, setFilterAllData] = useState([]);
    const [selectedLob, setSelectedLob] = useState(ALL_LOB);
    const [selectedBrand, setSelectedBrand] = useState(ALL_BRANDS);
    const [selectedDeviceType, setSelectedDeviceType] = useState(ALL_DEVICE_TYPES);
    const [selectedBookingType, setSelectedBookingType] = useState(ALL_BOOKING_TYPES);
    const [selectedEGSiteURL, setSelectedEGSiteURL] = useState(ALL_EG_SITE_URL);

    useQueryParamChange(props.selectedBrands[0], props.onBrandChange);
    useSelectedBrand(props.selectedBrands[0], props.onBrandChange, props.prevSelectedBrand);
    const [isLoading, res, error, bookingTypes, egSiteUrl, deviceTypes, brands, lobs] = useFetchBlipData(isApplyClicked, setIsApplyClicked, startDateTime, endDateTime, selectedLob, selectedBrand, selectedDeviceType, selectedBookingType, newBrand, props.prevSelectedBrand, selectedEGSiteURL);
    const handleLobChange = useCallback((lob) => {
        setSelectedLob(lob);
    }, []);
    const handleBrandChange = useCallback((brand) => {
        setSelectedBrand(brand);
    }, []);

    const handleDeviceTypeChange = useCallback((deviceType) => {
        setSelectedDeviceType(deviceType);
    }, []);
    const handleBookingTypeChange = useCallback((bookingType) => {
        setSelectedBookingType(bookingType);
    }, []);
    const handleEgSiteUrlChange = useCallback((bookingType) => {
        setSelectedEGSiteURL(bookingType);
    }, []);

    useEffect(() => {
        setFilterAllData([...res]);
    }, [res]);

    const handleDatetimeChange = ({start: startDateTimeStr, end: endDateTimeStr}) => {
        setStartDateTime(moment(startDateTimeStr).utc());
        setEndDDateTime(moment(endDateTimeStr).utc());
    };

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
            <h1 className="page-title">{'Impulse Dashboard'}</h1>
            <div className="impulse-filters-wrapper">
                <DatetimeRangePicker
                    onChange={handleDatetimeChange}
                    startDate={startDateTime.toDate()}
                    endDate={endDateTime.toDate()}
                />
                <FilterDropDown
                    id="lob-dropdown"
                    className="impulse-dropdown all-filters"
                    selectedValue={selectedLob}
                    list={lobs}
                    onClickHandler={handleLobChange}
                />
                <FilterDropDown
                    id="brand-dropdown"
                    className="impulse-dropdown all-filters"
                    selectedValue={selectedBrand}
                    list={brands}
                    onClickHandler={handleBrandChange}
                />
                <FilterDropDown
                    id="devicetype-dropdown"
                    className="impulse-dropdown all-filters"
                    selectedValue={selectedDeviceType}
                    list={deviceTypes}
                    onClickHandler={handleDeviceTypeChange}
                />
                <FilterDropDown
                    id="egsiteurl-dropdown"
                    className="impulse-dropdown all-filters"
                    selectedValue={selectedEGSiteURL}
                    list={egSiteUrl}
                    onClickHandler={handleEgSiteUrlChange}
                />
                <FilterDropDown
                    id="bookingtype-dropdown"
                    className="impulse-dropdown all-filters"
                    selectedValue={selectedBookingType}
                    list={bookingTypes}
                    onClickHandler={handleBookingTypeChange}
                />
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
            <Navigation
                noMobileSelect
                activeIndex={activeIndex}
                links={navLinks}
            />
            <LoadingContainer isLoading={isLoading} error={error} className="impulse-loading-container">
                <div className="chart-container">
                    <div className="bookings-container">
                        {renderTabs()}
                    </div>
                </div>
            </LoadingContainer>
        </div>
    );
};

export default Impulse;
