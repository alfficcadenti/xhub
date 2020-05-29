/* eslint-disable no-use-before-define */
import React, {Fragment, useState, useEffect, useCallback} from 'react';
import moment from 'moment';
import 'moment-timezone';
import LoadingContainer from '../../components/LoadingContainer';
import FilterDropDown from '../../components/FilterDropDown';
import {Navigation} from '@homeaway/react-navigation';
import DatePicker from '../../components/DatePicker/index';
import {Checkbox} from '@homeaway/react-form-components';
import {DATE_FORMAT, ALL_STATUSES_OPTION, ALL_PRIORITIES_OPTION} from '../constants';
import {Incidents, Overview, Top5, Quality, FinancialImpact} from './tabs/index';
import {useFetchTickets, useSetCovidTag} from './hooks';
import {EG_BRAND} from '../../components/App/constants';
import './styles.less';

const statusDefaultValue = ALL_STATUSES_OPTION;
const priorityDefaultValue = ALL_PRIORITIES_OPTION;
const covidTagDefaultValue = true;
const startDateDefaultValue = moment().subtract(90, 'days').format(DATE_FORMAT);
const endDateDefaultValue = moment().format(DATE_FORMAT);
const minDate = moment('2019-01-01').toDate();
const navLinks = [
    {
        id: 'overview',
        label: 'Overview',
        href: '/incident-trends'
    },
    {
        id: 'incidents',
        label: 'Incidents',
        href: '/incident-trends'
    },
    {
        id: 'top5',
        label: 'Top 5',
        href: '/incident-trends'
    },
    {
        id: 'quality',
        label: 'Quality',
        href: '/quality'
    },
    {
        id: 'financialImpact',
        label: 'Financial Impact',
        href: '/incident-trends'
    },
];


const IncidentTrendsDashboard = ({selectedBrands}) => {
    const [activeIndex, setActiveIndex] = useState(1);
    const [selectedStatus, setSelectedStatus] = useState(statusDefaultValue);
    const [selectedCovidTag, setSelectedCovidTag] = useState(covidTagDefaultValue);
    const [startDate, setStartDate] = useState(startDateDefaultValue);
    const [appliedStartDate, setAppliedStartDate] = useState(startDate);
    const [endDate, setEndDate] = useState(endDateDefaultValue);
    const [appliedEndDate, setAppliedEndDate] = useState(endDate);
    const [selectedPriority, setSelectedPriority] = useState(priorityDefaultValue);
    const [isDirtyForm, setIsDirtyForm] = useState(false);
    // incidents
    const [filteredUniqueIncidents, setFilteredUniqueIncidents] = useState([]);
    const [filteredAllIncidents, setFilteredAllIncidents] = useState([]);
    // defects
    const [filteredUniqueDefects, setFilteredUniqueDefects] = useState([]);

    const [isApplyClicked, setIsApplyClicked] = useState(false);
    const [currentPriorities, setCurrentPriorities] = useState([]);
    const [currentStatuses, setCurrentStatuses] = useState([]);
    const [
        isLoading,
        error,
        allUniqueIncidents,
        allIncidents,
        allUniqueDefects,
        allDefects,
        incidentsPriorities,
        defectsPriorities,
        incidentsStatuses,
        defectsStatuses
    ] = useFetchTickets(
        isApplyClicked,
        startDate,
        endDate,
        applyFilters,
        setIsApplyClicked,
        setCurrentPriorities,
        setCurrentStatuses
    );
    useSetCovidTag(setSelectedCovidTag);

    function applyFilters() {
        const matchesPriority = (t) => selectedPriority === priorityDefaultValue || t.priority === selectedPriority;
        const matchesBrand = (t) => selectedBrands[0] === EG_BRAND || selectedBrands.includes(t.Brand);
        const matchesStatus = (t) => selectedStatus === statusDefaultValue || t.status === selectedStatus;
        const matchesTag = (t) => !selectedCovidTag || t.tag.includes('covid-19');
        const filterTickets = (t) => matchesPriority(t) && matchesBrand(t) && matchesStatus(t) && matchesTag(t);
        // incidents
        setFilteredUniqueIncidents([...allUniqueIncidents].filter(filterTickets));
        setFilteredAllIncidents([...allIncidents].filter(filterTickets));
        // defects
        setFilteredUniqueDefects([...allUniqueDefects].filter(filterTickets));
        setAppliedStartDate(startDate);
        setAppliedEndDate(endDate);
        setIsDirtyForm(false);
    }

    useEffect(() => {
        applyFilters();
    }, [allUniqueIncidents, allIncidents, allUniqueDefects, allDefects]);

    const handleNavigationClick = (e, activeLinkIndex) => {
        setActiveIndex(activeLinkIndex);
        switch (activeLinkIndex) {
            case 1:
                setCurrentPriorities(incidentsPriorities);
                setCurrentStatuses(incidentsStatuses);
                break;
            case 3:
                setCurrentPriorities(defectsPriorities);
                setCurrentStatuses(defectsStatuses);
                break;
            default:
                setCurrentPriorities(incidentsPriorities);
                setCurrentStatuses(incidentsStatuses);
        }
    };

    const handleDateRangeChange = (start, end) => {
        setStartDate(start || startDate);
        setEndDate(end || endDate);
        setIsDirtyForm(true);
    };

    const handleClearDates = () => {
        setStartDate('');
        setEndDate('');
        setFilteredUniqueIncidents([]);
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

    const handleCovidTagChange = () => {
        setSelectedCovidTag(!selectedCovidTag);
        setIsDirtyForm(true);
    };

    // eslint-disable-next-line complexity
    const renderTabs = () => {
        switch (activeIndex) {
            case 0:
                return <Overview startDate={appliedStartDate} endDate={appliedEndDate} filteredIncidents={filteredUniqueIncidents} />;
            case 1:
                return <Incidents filteredIncidents={filteredUniqueIncidents} />;
            case 2:
                return <Top5 filteredIncidents={filteredUniqueIncidents} />;
            case 3:
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
            case 4:
                return <FinancialImpact filteredIncidents={filteredAllIncidents} />;
            default:
                return <Incidents filteredIncidents={filteredUniqueIncidents} />;
        }
    };

    return (
        <Fragment>
            <h1 className="page-title">{'Defect & Incident Trends'}</h1>
            <div className="filters-wrapper">
                <DatePicker
                    startDate={startDate}
                    endDate={endDate}
                    minDate={minDate}
                    handleDateRangeChange={handleDateRangeChange}
                    handleClearDates={handleClearDates}
                />
                <FilterDropDown id="priority-dropdown" className="priority-dropdown" list={currentPriorities} selectedValue={selectedPriority} onClickHandler={handlePriorityChange}/>
                <FilterDropDown id="status-dropdown" className="status-dropdown" list={currentStatuses} selectedValue={selectedStatus} onClickHandler={handleStatusChange}/>
                <Checkbox name="covid-19" label="covid-19" checked={selectedCovidTag} onChange={handleCovidTagChange}/>
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
