/* eslint-disable no-use-before-define */
import React, {Fragment, useState, useEffect, useCallback} from 'react';
import moment from 'moment/moment';
import 'moment-timezone';
import LoadingContainer from '../../../components/LoadingContainer';
import FilterDropDown from '../../../components/FilterDropDown';
import {Navigation} from '@homeaway/react-navigation';
import DatePicker from '../../../components/DatePicker/index';
// import {Checkbox} from '@homeaway/react-form-components';
import {DATE_FORMAT, ALL_STATUSES_OPTION, ALL_PRIORITIES_OPTION} from '../../constants';
import {Quality} from './tabs/index';
import {useFetchTickets, useSetCovidTag} from '../hooks';
import {EG_BRAND, getBrand} from '../../../components/App/constants';
import './styles.less';

const statusDefaultValue = ALL_STATUSES_OPTION;
const priorityDefaultValue = ALL_PRIORITIES_OPTION;
const covidTagDefaultValue = true;
const startDateDefaultValue = moment().subtract(90, 'days').format(DATE_FORMAT);
const endDateDefaultValue = moment().format(DATE_FORMAT);
const minDate = moment('2019-01-01').toDate();
const navLinks = [
    {
        id: 'quality',
        label: 'Quality',
        href: '/quality'
    }
];


const IncidentTrendsDashboard = (props) => {
    const selectedBrands = props.selectedBrands.map((brand) => getBrand(brand).incidentBrand);

    const [activeIndex, setActiveIndex] = useState(1);
    const [selectedStatus, setSelectedStatus] = useState(statusDefaultValue);
    const [selectedCovidTag, setSelectedCovidTag] = useState(covidTagDefaultValue);
    const [startDate, setStartDate] = useState(startDateDefaultValue);
    const [appliedStartDate, setAppliedStartDate] = useState(startDate);
    const [endDate, setEndDate] = useState(endDateDefaultValue);
    const [appliedEndDate, setAppliedEndDate] = useState(endDate);
    const [selectedPriority, setSelectedPriority] = useState(priorityDefaultValue);
    const [isDirtyForm, setIsDirtyForm] = useState(false);
    // defects
    const [filteredUniqueDefects, setFilteredUniqueDefects] = useState([]);

    const [isApplyClicked, setIsApplyClicked] = useState(false);
    const [
        isLoading,
        error,
        allUniqueDefects,
        allDefects,
        defectsPriorities,
        defectsStatuses
    ] = useFetchTickets(
        isApplyClicked,
        startDate,
        endDate,
        applyFilters,
        setIsApplyClicked,
        'defects'
    );
    useSetCovidTag(setSelectedCovidTag);

    function applyFilters() {
        const matchesPriority = (t) => selectedPriority === priorityDefaultValue || t.priority === selectedPriority;
        const matchesBrand = (t) => selectedBrands[0] === EG_BRAND || selectedBrands.includes(t.Brand);
        const matchesStatus = (t) => selectedStatus === statusDefaultValue || t.status === selectedStatus;
        const matchesTag = (t) => !selectedCovidTag || t.tag.includes('covid-19');
        const filterTickets = (t) => matchesPriority(t) && matchesBrand(t) && matchesStatus(t) && matchesTag(t);

        // defects
        setFilteredUniqueDefects([...allUniqueDefects].filter(filterTickets));

        setAppliedStartDate(startDate);
        setAppliedEndDate(endDate);
        setIsDirtyForm(false);
    }

    useEffect(() => {
        applyFilters();
    }, [allUniqueDefects, allDefects]);

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
        setFilteredUniqueDefects([]);
        setIsDirtyForm(true);
    };

    const handlePriorityChange = useCallback((priority) => {
        setSelectedPriority(priority);
        setIsDirtyForm(true);
    }, []);

    const handleStatusChange = useCallback((status) => {
        setSelectedStatus(status);
        setIsDirtyForm(true);
    }, []);

    // const handleCovidTagChange = () => {
    //     setSelectedCovidTag(!selectedCovidTag);
    //     setIsDirtyForm(true);
    // };

    // eslint-disable-next-line complexity
    const renderTabs = () => {
        switch (activeIndex) {
            case 0:
                return (
                    <Quality
                        startDate={appliedStartDate}
                        endDate={appliedEndDate}
                        filteredDefects={filteredUniqueDefects}
                        selectedCovidTag={selectedCovidTag}
                        setIsApplyClicked={setIsApplyClicked}
                        handleStatusChange={handleStatusChange}
                        handlePriorityChange={handlePriorityChange}
                    />);
            default:
                return (
                    <Quality
                        startDate={appliedStartDate}
                        endDate={appliedEndDate}
                        filteredDefects={filteredUniqueDefects}
                        selectedCovidTag={selectedCovidTag}
                        setIsApplyClicked={setIsApplyClicked}
                        handleStatusChange={handleStatusChange}
                        handlePriorityChange={handlePriorityChange}
                    />);
        }
    };

    return (
        <Fragment>
            <h1 className="page-title">{'Defect Trends'}</h1>
            <div className="filters-wrapper">
                <DatePicker
                    startDate={startDate}
                    endDate={endDate}
                    minDate={minDate}
                    handleDateRangeChange={handleDateRangeChange}
                    handleClearDates={handleClearDates}
                />
                <FilterDropDown id="priority-dropdown" className="priority-dropdown" list={defectsPriorities} selectedValue={selectedPriority} onClickHandler={handlePriorityChange}/>
                <FilterDropDown id="status-dropdown" className="status-dropdown" list={defectsStatuses} selectedValue={selectedStatus} onClickHandler={handleStatusChange}/>
                {/* <Checkbox name="covid-19" label="covid-19" checked={selectedCovidTag} onChange={handleCovidTagChange}/> */}
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
            </div>
            <Navigation
                noMobileSelect
                activeIndex={activeIndex}
                links={navLinks}
                onLinkClick={handleNavigationClick}
            />
            <LoadingContainer isLoading={isLoading} error={error} className="incident-main">
                {renderTabs()}
            </LoadingContainer>
        </Fragment>
    );
};

export default IncidentTrendsDashboard;
