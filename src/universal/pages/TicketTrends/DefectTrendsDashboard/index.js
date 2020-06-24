/* eslint-disable no-use-before-define */
import React, {useState, useEffect, useCallback} from 'react';
import moment from 'moment/moment';
import 'moment-timezone';
import LoadingContainer from '../../../components/LoadingContainer';
import FilterDropDown from '../../../components/FilterDropDown';
import DatePicker from '../../../components/DatePicker/index';
import {DATE_FORMAT, ALL_STATUSES_OPTION, ALL_PRIORITIES_OPTION} from '../../constants';
import {Quality} from './tabs/index';
import {useFetchTickets} from '../hooks';
import {EG_BRAND, getBrand} from '../../../components/App/constants';
import './styles.less';

const statusDefaultValue = ALL_STATUSES_OPTION;
const priorityDefaultValue = ALL_PRIORITIES_OPTION;
const startDateDefaultValue = moment().subtract(90, 'days').format(DATE_FORMAT);
const endDateDefaultValue = moment().format(DATE_FORMAT);
const minDate = moment('2019-01-01').toDate();


const IncidentTrendsDashboard = (props) => {
    const selectedBrands = props.selectedBrands.map((brand) => getBrand(brand).incidentBrand);

    const [selectedStatus, setSelectedStatus] = useState(statusDefaultValue);
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

    function applyFilters() {
        const matchesPriority = (t) => selectedPriority === priorityDefaultValue || t.priority === selectedPriority;
        const matchesBrand = (t) => selectedBrands[0] === EG_BRAND || selectedBrands.includes(t.Brand);
        const matchesStatus = (t) => selectedStatus === statusDefaultValue || t.status === selectedStatus;
        const filterTickets = (t) => matchesPriority(t) && matchesBrand(t) && matchesStatus(t);

        // defects
        setFilteredUniqueDefects([...allUniqueDefects].filter(filterTickets));

        setAppliedStartDate(startDate);
        setAppliedEndDate(endDate);
        setIsDirtyForm(false);
    }

    useEffect(() => {
        applyFilters();
    }, [allUniqueDefects, allDefects]);

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

    return (
        <div className="defect-trends-dashboard">
            <h1 className="page-title">{'Quality Trends'}</h1>
            <div className="filters-wrapper">
                <DatePicker
                    startDate={startDate}
                    endDate={endDate}
                    minDate={minDate}
                    handleDateRangeChange={handleDateRangeChange}
                    handleClearDates={handleClearDates}
                />
                <FilterDropDown id="priority-dropdown" className="priority-dropdown" list={defectsPriorities} selectedValue={selectedPriority} onClickHandler={handlePriorityChange} />
                <FilterDropDown id="status-dropdown" className="status-dropdown" list={defectsStatuses} selectedValue={selectedStatus} onClickHandler={handleStatusChange} />
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
            <LoadingContainer isLoading={isLoading} error={error} className="incident-main">
                <Quality
                    startDate={appliedStartDate}
                    endDate={appliedEndDate}
                    filteredDefects={filteredUniqueDefects}
                    setIsApplyClicked={setIsApplyClicked}
                    handleStatusChange={handleStatusChange}
                    handlePriorityChange={handlePriorityChange}
                />
            </LoadingContainer>
        </div>
    );
};

export default IncidentTrendsDashboard;
