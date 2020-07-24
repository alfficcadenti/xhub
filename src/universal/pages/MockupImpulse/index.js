import React, {useState, useCallback, useEffect} from 'react';
import {useFetchBlipData} from './customHook';
import {Navigation} from '@homeaway/react-navigation';
import LoadingContainer from '../../components/LoadingContainer';
import DatePicker from '../../components/DatePicker/index';
import FilterDropDown from '../../components/FilterDropDown';
import {BookingTrends} from './tabs/index';
import moment from 'moment/moment';
import {
    DATE_FORMAT,
    ALL_LOB,
    TIME_INTERVALS_IMPULSE,
    TIME_INTERVAL,
    ALL_BRANDS,
    ALL_BRAND_GROUP,
    BRAND_GROUPS,
    LOBS,
    BRANDS_LIST
} from '../../constants';
import './styles.less';

const startDateDefaultValue = moment().subtract(90, 'days').format(DATE_FORMAT);
const endDateDefaultValue = moment().format(DATE_FORMAT);
const minDate = moment('2019-01-01').toDate();
const activeIndex = 0;
const navLinks = [
    {
        id: 'actualvsprediction',
        label: 'Booking Trends',
        href: '/impulse'
    }
];

const BlipDashBoard = () => {
    const [startDate, setStartDate] = useState(startDateDefaultValue);
    const [endDate, setEndDate] = useState(endDateDefaultValue);
    const [isApplyClicked, setIsApplyClicked] = useState(false);
    const [allData, setFilterAllData] = useState([]);
    const [selectedLob, setSelectedLob] = useState(ALL_LOB);
    const [selectedBrand, setSelectedBrand] = useState(ALL_BRANDS);

    const [selectedInterval, setSelectedInterval] = useState(TIME_INTERVAL);
    const [selectedBrandGroup, setSelectedBrandGroup] = useState(ALL_BRAND_GROUP);

    const [isLoading, res, error] = useFetchBlipData(isApplyClicked, setIsApplyClicked, startDate, endDate, selectedLob, selectedBrand, selectedInterval, selectedBrandGroup);

    const handleLobChange = useCallback((lob) => {
        setSelectedLob(lob);
    }, []);
    const handleBrandChange = useCallback((brand) => {
        setSelectedBrand(brand);
    }, []);
    const handleIntervalChange = useCallback((interval) => {
        setSelectedInterval(interval);
    }, []);
    const handleBrandGroupChange = useCallback((brandGroup) => {
        setSelectedBrandGroup(brandGroup);
    }, []);

    useEffect(() => {
        setFilterAllData([...res]);
    }, [res]);
    const handleDateRangeChange = (start, end) => {
        setStartDate(start || startDate);
        setEndDate(end || endDate);
    };

    const handleClearDates = () => {
        setStartDate('');
        setEndDate('');
        setFilterAllData([]);
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

        <div className="incident-trends-container">
            <h1 className="page-title">{'Impulse Dashboard'}</h1>
            <div className="filters-wrapper">
                <DatePicker
                    startDate={startDate}
                    endDate={endDate}
                    minDate={minDate}
                    handleDateRangeChange={handleDateRangeChange}
                    handleClearDates={handleClearDates}
                />
                <FilterDropDown
                    id="lob-dropdown"
                    className="priority-dropdown"
                    selectedValue={selectedLob}
                    list={[ALL_LOB, ...LOBS]}
                    onClickHandler={handleLobChange}
                />
                <FilterDropDown
                    id="brand-dropdown"
                    className="priority-dropdown"
                    selectedValue={selectedBrand}
                    list={[ALL_BRANDS, ...BRANDS_LIST]}
                    onClickHandler={handleBrandChange}
                />
                <FilterDropDown
                    id="timeinterval-dropdown"
                    className="priority-dropdown"
                    selectedValue={selectedInterval}
                    list={TIME_INTERVALS_IMPULSE}
                    onClickHandler={handleIntervalChange}
                />
                <FilterDropDown
                    id="brandgroup-dropdown"
                    className="priority-dropdown"
                    selectedValue={selectedBrandGroup}
                    list={[ALL_BRAND_GROUP, ...BRAND_GROUPS]}
                    onClickHandler={handleBrandGroupChange}
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
            <LoadingContainer isLoading={isLoading} error={error} className="incident-main">
                <div className="chart-container">
                    <div className="bookings-container">
                        {renderTabs()}
                    </div>
                </div>
            </LoadingContainer>
        </div>
    );
};

export default BlipDashBoard;
