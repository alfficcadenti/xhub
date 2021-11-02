import React, {useState, useEffect, useCallback} from 'react';
import {withRouter} from 'react-router-dom';
import moment from 'moment/moment';
import LoadingContainer from '../../../components/LoadingContainer';
import FilterDropDown from '../../../components/FilterDropDown';
import {DATE_FORMAT, ALL_STATUSES_OPTION, ALL_PRIORITIES_OPTION} from '../../../constants';
import {Quality} from './tabs/index';
import {useFetchTickets} from '../hooks';
import {EG_BRAND} from '../../../constants';
import {useQueryParamChange, useSelectedBrand} from '../../hooks';
import {DatetimeRangePicker} from '../../../components/DatetimeRangePicker';
import './styles.less';


const statusDefaultValue = ALL_STATUSES_OPTION;
const priorityDefaultValue = ALL_PRIORITIES_OPTION;
const startDateDefaultValue = moment().subtract(14, 'days').format(DATE_FORMAT);
const endDateDefaultValue = moment().format(DATE_FORMAT);


const IncidentTrendsDashboard = ({selectedBrands, onBrandChange, prevSelectedBrand}) => {
    const selectedBrand = selectedBrands[0];

    const [selectedStatus, setSelectedStatus] = useState(statusDefaultValue);
    const [pendingStart, setPendingStart] = useState(startDateDefaultValue);
    const [start, setStart] = useState(pendingStart);
    const [pendingEnd, setPendingEnd] = useState(endDateDefaultValue);
    const [end, setEnd] = useState(pendingEnd);
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
        defectsStatuses,
    ] = useFetchTickets(
        isApplyClicked,
        pendingStart,
        pendingEnd,
        // eslint-disable-next-line no-use-before-define
        applyFilters,
        setIsApplyClicked,
        'defects',
        selectedBrands
    );
    useQueryParamChange(onBrandChange);
    useSelectedBrand(selectedBrand, prevSelectedBrand);

    function applyFilters() {
        const matchesPriority = (t) => selectedPriority === priorityDefaultValue || t.priority === selectedPriority;
        const matchesBrand = (t) => selectedBrand === EG_BRAND || selectedBrand === t.Brand;
        const matchesStatus = (t) => selectedStatus === statusDefaultValue || t.status === selectedStatus;
        const filterTickets = (t) => matchesPriority(t) && matchesBrand(t) && matchesStatus(t);

        // defects
        setFilteredUniqueDefects([...allUniqueDefects].filter(filterTickets));

        setStart(pendingStart);
        setEnd(pendingEnd);
        setIsDirtyForm(false);
    }

    useEffect(() => {
        applyFilters();
    }, [allUniqueDefects, allDefects]);

    const handleDateRangeChange = ({start: startDate, end: endDate}) => {
        setPendingStart(moment(startDate).format(DATE_FORMAT));
        setPendingEnd(moment(endDate).format(DATE_FORMAT));
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
                <DatetimeRangePicker
                    onChange={handleDateRangeChange}
                    startDate={moment(pendingStart).toDate()}
                    endDate={moment(pendingEnd).toDate()}
                    hidePresets
                />
                <FilterDropDown
                    id="priority-dropdown"
                    className="priority-dropdown"
                    list={defectsPriorities}
                    selectedValue={selectedPriority}
                    onClickHandler={handlePriorityChange}
                />
                <FilterDropDown
                    id="status-dropdown"
                    className="status-dropdown"
                    list={defectsStatuses}
                    selectedValue={selectedStatus}
                    onClickHandler={handleStatusChange}
                />
                <button
                    type="button"
                    className="apply-button btn btn-primary active"
                    onClick={() => setIsApplyClicked(true)}
                    disabled={!isDirtyForm}
                >
                    {'Apply'}
                </button>
            </div>
            <LoadingContainer isLoading={isLoading} error={error} className="incident-main">
                <Quality
                    startDate={start}
                    endDate={end}
                    filteredDefects={filteredUniqueDefects}
                    setIsApplyClicked={setIsApplyClicked}
                    handleStatusChange={handleStatusChange}
                    handlePriorityChange={handlePriorityChange}
                />
            </LoadingContainer>
        </div>
    );
};

export default withRouter(IncidentTrendsDashboard);
