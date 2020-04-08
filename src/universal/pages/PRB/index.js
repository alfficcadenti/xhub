/* eslint-disable no-use-before-define */
import React, {useState, useEffect} from 'react';
import moment from 'moment';
import 'moment-timezone';
import LoadingContainer from '../../components/LoadingContainer';
import FilterDropDown from '../../components/FilterDropDown';
import DatePicker from '../../components/DatePicker';
import DataTable from '../../components/DataTable';
import {
    DATE_FORMAT, BRANDS, ALL_STATUSES_OPTION, ALL_PRIORITIES_OPTION, ALL_BRANDS_OPTION, ALL_TYPES_OPTION
} from '../constants';
import {useFetchTickets} from './hooks';
import './styles.less';

const statusDefaultValue = ALL_STATUSES_OPTION;
const brandDefaultValue = ALL_BRANDS_OPTION;
const typeDefaultValue = ALL_TYPES_OPTION;
const priorityDefaultValue = ALL_PRIORITIES_OPTION;
const startDateDefaultValue = moment().subtract(90, 'days').format(DATE_FORMAT);
const endDateDefaultValue = moment().format(DATE_FORMAT);
const minDate = moment('2019-01-01').toDate();


const PRB = () => {
    const [selectedType, setSelectedType] = useState(typeDefaultValue);
    const [selectedStatus, setSelectedStatus] = useState(statusDefaultValue);
    const [selectedBrand, setSelectedBrand] = useState(brandDefaultValue);
    const [startDate, setStartDate] = useState(startDateDefaultValue);
    const [endDate, setEndDate] = useState(endDateDefaultValue);
    const [selectedPriority, setSelectedPriority] = useState(priorityDefaultValue);
    const [isDirtyForm, setIsDirtyForm] = useState(false);

    const [isApplyClicked, setIsApplyClicked] = useState(false);
    const [currentPriorities, setCurrentPriorities] = useState(['0-Code Red', '1-Critical', '2-High', '3-Medium', '4-Low']);
    const [currentStatuses, setCurrentStatuses] = useState(['To Do', 'In Progress', 'Done', 'Resolved', 'Testing', 'Closed']);
    const [currentTypes, setCurrentTypes] = useState(['Corrective Action', 'Incident', 'Post Mortum', 'Resiliency Validation']);

    const [filteredTickets, setFilteredTickets] = useState([]);

    const [
        isLoading,
        error,
        allTickets
    ] = useFetchTickets(
        isApplyClicked,
        startDate,
        endDate,
        applyFilters,
        setIsApplyClicked,
        setCurrentPriorities,
        setCurrentStatuses,
        setCurrentTypes
    );

    function filterType(tickets) {
        let result = [];
        tickets.forEach((t) => {
            const {linkedIssues} = t;
            const filteredLinkedIssues = (linkedIssues || []).filter((i) => !i['Issue Type'].localeCompare(selectedType));
            if (filteredLinkedIssues.length > 0) {
                const filteredT = t;
                filteredT.linkedIssues = filteredLinkedIssues;
                filteredT['Linked Issues'] = (
                    <>
                        <h3>{'Linked Issues'}</h3>
                        <DataTable
                            className="linked-issues__table"
                            data={filteredLinkedIssues}
                            columns={['Ticket', 'Summary', 'Issue Type', 'Status', 'Assignee']}
                            expandableColumns={['Linked Issues']}
                        />
                    </>
                );
                result.push(filteredT);
            }
        });
        return result;
    }

    function applyFilters() {
        const matchesPriority = (t) => selectedPriority === priorityDefaultValue || t.Priority === selectedPriority;
        const matchesBrand = (t) => selectedBrand === brandDefaultValue || t.Brand === selectedBrand;
        const matchesStatus = (t) => selectedStatus === statusDefaultValue || t.Status === selectedStatus;
        const filterTickets = (t) => matchesPriority(t) && matchesBrand(t) && matchesStatus(t);
        let result = allTickets.filter(filterTickets);
        if (selectedType !== typeDefaultValue) {
            result = filterType(result);
        }
        setFilteredTickets(result);
        setIsDirtyForm(false);
    }

    useEffect(() => {
        applyFilters();
    }, [allTickets]);

    const handleDateRangeChange = (start, end) => {
        setStartDate(start || startDate);
        setEndDate(end || endDate);
        setIsDirtyForm(true);
    };

    const handleClearDates = () => {
        setStartDate('');
        setEndDate('');
        setIsDirtyForm(true);
    };

    const handlePriorityChange = (priority) => {
        setSelectedPriority(priority);
        setIsDirtyForm(true);
    };

    const handleBrandChange = (brand) => {
        setSelectedBrand(brand);
        setIsDirtyForm(true);
    };

    const handleStatusChange = (status) => {
        setSelectedStatus(status);
        setIsDirtyForm(true);
    };

    const handleTypeChange = (type) => {
        setSelectedType(type);
        setIsDirtyForm(true);
    };

    // eslint-disable-next-line complexity
    const renderTable = () => (
        <DataTable
            title={`Tickets (${filteredTickets.length} ${filteredTickets.length === 1 ? 'result' : 'results'})`}
            data={filteredTickets || []}
            columns={['Ticket', 'Priority', 'Brand', 'Opened', 'Summary', 'Status']}
            expandableColumns={['Linked Issues']}
        />
    );

    return (
        <div className="pm-container">
            <h1 className="page-title">{'Problem Management'}</h1>
            <div id="filters-wrapper">
                <DatePicker
                    startDate={startDate}
                    endDate={endDate}
                    minDate={minDate}
                    handleDateRangeChange={handleDateRangeChange}
                    handleClearDates={handleClearDates}
                />
                <FilterDropDown id="priority-dropdown" className="filter-dropdown" list={[priorityDefaultValue, ...currentPriorities]} selectedValue={selectedPriority} onClickHandler={handlePriorityChange}/>
                <FilterDropDown id="brand-dropdown" className="filter-dropdown" list={BRANDS} selectedValue={selectedBrand} onClickHandler={handleBrandChange}/>
                <FilterDropDown id="status-dropdown" className="filter-dropdown" list={[statusDefaultValue, ...currentStatuses]} selectedValue={selectedStatus} onClickHandler={handleStatusChange}/>
                <FilterDropDown id="type-dropdown" className="filter-dropdown" list={[typeDefaultValue, ...currentTypes]} selectedValue={selectedType} onClickHandler={handleTypeChange}/>
                <button
                    id="applyButton"
                    type="button"
                    className="btn btn-primary active"
                    onClick={() => {
                        setIsApplyClicked(true);
                    }}
                    disabled={!isDirtyForm}
                >
                    {'Apply'}
                </button>
            </div>
            <LoadingContainer isLoading={isLoading} error={error} className="pm-table">
                {renderTable()}
            </LoadingContainer>
        </div>
    );
};

export default PRB;
