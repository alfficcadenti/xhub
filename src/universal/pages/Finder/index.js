/* eslint-disable no-use-before-define */
import React, {useState, useEffect, useCallback} from 'react';
import moment from 'moment';
import 'moment-timezone';
import {Navigation} from '@homeaway/react-navigation';
import LoadingContainer from '../../components/LoadingContainer';
import FilterDropDown from '../../components/FilterDropDown';
import DatePicker from '../../components/DatePicker/index';
import SearchableList from '@homeaway/react-searchable-list';
import {DATE_FORMAT} from '../../constants';
import {SVGIcon} from '@homeaway/react-svg';
import {FILTER__16} from '@homeaway/svg-defs';
import {Divider} from '@homeaway/react-collapse';
import {
    ALL_PLATFORMS_OPTION,
    ALL_BUSINESS_REASONS_OPTION,
    ALL_STATUSES_OPTION,
} from './constants';
import {ChangeRequests} from './tabs/index';
import {useFetchCRs} from './hooks';
import {EG_BRAND} from '../../constants';
import {useSelectedBrand, useQueryParamChange} from '../hooks';
import './styles.less';

const platformDefaultValue = ALL_PLATFORMS_OPTION;
const businessReasonDefaultValue = ALL_BUSINESS_REASONS_OPTION;
const statusDefaultValue = ALL_STATUSES_OPTION;
const startDateDefaultValue = moment().subtract(7, 'days').format(DATE_FORMAT);
const endDateDefaultValue = moment().format(DATE_FORMAT);
const minDate = moment('2019-01-01').toDate();
const navLinks = [
    {
        id: 'changeRequests',
        label: 'Change Requests',
        href: '/change-requests'
    }
];

const Finder = (props) => {
    const selectedBrand = props.selectedBrands[0];
    const [activeIndex, setActiveIndex] = useState(1);
    const [selectedPlatform, setSelectedPlatform] = useState(platformDefaultValue);
    const [selectedStatus, setSelectedStatus] = useState(statusDefaultValue);
    const [startDate, setStartDate] = useState(startDateDefaultValue);
    const [endDate, setEndDate] = useState(endDateDefaultValue);
    const [filterValue, setFilterValue] = useState();
    const [selectedBusinessReason, setSelectedBusinessReason] = useState(businessReasonDefaultValue);
    const [isDirtyForm, setIsDirtyForm] = useState(false);
    const [filteredUniqueCRs, setFilteredUniqueCRs] = useState([]);
    const [isApplyClicked, setIsApplyClicked] = useState(false);
    const [showMoreFilters, setShowMoreFilters] = useState(false);
    const [
        isLoading,
        error,
        allUniqueCRs,
        allCRs,
        indexedData,
        dataPlatforms,
        dataBusinessReasons,
        dataStatuses
    ] = useFetchCRs(
        isApplyClicked,
        startDate,
        endDate,
        applyFilters,
        setIsApplyClicked
    );
    useQueryParamChange(selectedBrand, props.onBrandChange);
    useSelectedBrand(selectedBrand, props.onBrandChange, props.prevSelectedBrand);

    function applyFilters() {
        const matchesSearchInputFilter = (t) => filterValue ? t.productName === filterValue || t.applicationName === filterValue || t.number === filterValue || t.team === filterValue : true;
        const matchesBrand = (t) => selectedBrand === EG_BRAND || selectedBrand === t.Brand;
        const matchesStatus = (t) => selectedStatus === statusDefaultValue || selectedStatus === t.status;
        const matchesPlatform = (t) => selectedPlatform === platformDefaultValue || t.platform === selectedPlatform;
        const matchesBusinessReason = (t) => selectedBusinessReason === businessReasonDefaultValue || t.businessReason === selectedBusinessReason;
        const filterCRs = (t) => matchesBrand(t) && matchesSearchInputFilter(t) && matchesPlatform(t) && matchesBusinessReason(t) && matchesStatus(t);
        setFilteredUniqueCRs([...allUniqueCRs].filter(filterCRs));
        setIsDirtyForm(false);
    }

    useEffect(() => {
        applyFilters();
    }, [allUniqueCRs, allCRs, selectedBrand]);

    const handleNavigationClick = (e, activeLinkIndex) => {
        setActiveIndex(activeLinkIndex);
    };

    const handleDateRangeChange = (start, end) => {
        setStartDate(start || startDate);
        setEndDate(end || endDate);
        setIsDirtyForm(true);
    };

    const handleClearDates = () => {
        setStartDate('');
        setEndDate('');
        setFilteredUniqueCRs([]);
        setIsDirtyForm(true);
    };

    const handleFilterValueChange = useCallback((value) => {
        /* eslint-disable no-unused-expressions */
        value && value.length ? setFilterValue(value[0]) : setFilterValue('');
        setIsDirtyForm(true);
    }, []);

    const handlePlatformChange = useCallback((platform) => {
        setSelectedPlatform(platform);
        setIsDirtyForm(true);
    }, []);

    const handleStatusChange = useCallback((status) => {
        setSelectedStatus(status);
        setIsDirtyForm(true);
    }, []);

    const handleBusinessReasonChange = useCallback((businessReason) => {
        setSelectedBusinessReason(businessReason);
        setIsDirtyForm(true);
    }, []);

    const handleShowMoreFilters = () => {
        setShowMoreFilters(!showMoreFilters);
    };

    const renderTabs = () => {
        switch (activeIndex) {
            case 0:
                return <ChangeRequests filteredCR={filteredUniqueCRs} selectedBrand={selectedBrand}/>;
            default:
                return <ChangeRequests filteredCR={filteredUniqueCRs} selectedBrand={selectedBrand}/>;
        }
    };

    const renderMoreFilters = () => (
        <Divider heading="More Filters" id="more-filters-divider" className="more-filters-divider" expanded={showMoreFilters}>
            <form className="search-form search-form__more">
                <FilterDropDown
                    id="platform-dropdown"
                    className="platform-dropdown"
                    list={dataPlatforms}
                    selectedValue={selectedPlatform}
                    onClickHandler={handlePlatformChange}
                />
                <FilterDropDown
                    id="business-reasons-dropdown"
                    className="business-reasons-dropdown"
                    list={dataBusinessReasons}
                    selectedValue={selectedBusinessReason}
                    onClickHandler={handleBusinessReasonChange}
                />
                <FilterDropDown
                    id="status-dropdown"
                    className="status-dropdown"
                    list={dataStatuses}
                    selectedValue={selectedStatus}
                    onClickHandler={handleStatusChange}
                />
            </form>
        </Divider>
    );

    return (
        <div className="change-requests-container">
            <h1 className="page-title">{'Change Finder'}</h1>
            <div className="filters-wrapper">
                <DatePicker
                    startDate={startDate}
                    endDate={endDate}
                    minDate={minDate}
                    handleDateRangeChange={handleDateRangeChange}
                    handleClearDates={handleClearDates}
                />
                <SearchableList
                    inputProps={{label: 'Search by CR Number, Application, Product or Team name', id: 'indexed-list-filter'}}
                    options={indexedData}
                    maxResults={500}
                    onChange={(selected) => {
                        handleFilterValueChange(selected);
                    }}
                />
                <button
                    type="button"
                    className="apply-button btn btn-primary active"
                    onClick={() => {
                        setIsApplyClicked(true);
                    }}
                    disabled={!isDirtyForm}
                >
                    {'Apply'}
                </button>
                <button
                    type="button"
                    className={`btn btn-default more-filters-btn ${showMoreFilters ? 'active' : ''}`}
                    onClick={handleShowMoreFilters}
                >
                    <SVGIcon usefill markup={FILTER__16} />{' More Filters'}
                </button>

            </div>
            <div>{renderMoreFilters()}</div>
            <Navigation
                noMobileSelect
                activeIndex={activeIndex}
                links={navLinks}
                onLinkClick={handleNavigationClick}
            />
            <LoadingContainer isLoading={isLoading} error={error}>
                {renderTabs()}
            </LoadingContainer>
        </div>
    );
};

export default Finder;
