/* eslint-disable no-use-before-define */
import React, {Fragment, useState, useEffect} from 'react';
import moment from 'moment';
import 'moment-timezone';
import LoadingContainer from '../../components/LoadingContainer';
import FilterDropDown from '../../components/FilterDropDown';
import {Navigation} from '@homeaway/react-navigation';
import DatePicker from '../../components/DatePicker/index';
import {Checkbox} from '@homeaway/react-form-components';
import {DATE_FORMAT, BRANDS, ALL_STATUSES, ALL_PRIORITIES_OPTION} from './constants';
import {Incidents, Overview, Top5, Quality, FinancialImpact} from './tabs/index';
import {useFetchTickets, useSetCovidTag} from './hooks';
import './styles.less';

const statusDefaultValue = 'All Statuses';
const brandDefaultValue = 'All Brands';
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


const IncidentTrendsDashboard = () => {
    const [activeIndex, setActiveIndex] = useState(1);
    const [selectedStatus, setSelectedStatus] = useState(statusDefaultValue);
    const [selectedBrand, setSelectedBrand] = useState(brandDefaultValue);
    const [selectedCovidTag, setSelectedCovidTag] = useState(covidTagDefaultValue);
    const [startDate, setStartDate] = useState(startDateDefaultValue);
    const [endDate, setEndDate] = useState(endDateDefaultValue);
    const [selectedPriority, setSelectedPriority] = useState(priorityDefaultValue);
    const [isDirtyForm, setIsDirtyForm] = useState(false);
    // incidents
    const [filteredUniqueIncidents, setFilteredUniqueIncidents] = useState([]);
    const [filteredAllIncidents, setFilteredAllIncidents] = useState([]);
    // defects
    const [filteredUniqueDefects, setFilteredUniqueDefects] = useState([]);

    const [isApplyClicked, setIsApplyClicked] = useState(false);
    const [currentPriorities, setCurrentPriorities] = useState([]);
    const [
        isLoading,
        error,
        allUniqueIncidents,
        allIncidents,
        allUniqueDefects,
        allDefects,
        incidentsPriorities,
        defectsPriorities,
    ] = useFetchTickets(
        isApplyClicked,
        startDate,
        endDate,
        applyFilters,
        setIsApplyClicked,
        setCurrentPriorities
    );
    useSetCovidTag(setSelectedCovidTag);

    function applyFilters() {
        const matchesPriority = (t) => selectedPriority === priorityDefaultValue || t.priority === selectedPriority;
        const matchesBrand = (t) => selectedBrand === brandDefaultValue || t.Brand === selectedBrand;
        const matchesStatus = (t) => selectedStatus === statusDefaultValue || t.status === selectedStatus;
        const matchesTag = (t) => !selectedCovidTag || t.tag.includes('covid-19');
        const filterTickets = (t) => matchesPriority(t) && matchesBrand(t) && matchesStatus(t) && matchesTag(t);
        // incidents
        setFilteredUniqueIncidents([...allUniqueIncidents].filter(filterTickets));
        setFilteredAllIncidents([...allIncidents].filter(filterTickets));
        // defects
        setFilteredUniqueDefects([...allUniqueDefects].filter(filterTickets));
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
                break;
            case 3:
                setCurrentPriorities(defectsPriorities);
                break;
            default:
                setCurrentPriorities(incidentsPriorities);
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

    const handleCovidTagChange = () => {
        setSelectedCovidTag(!selectedCovidTag);
        setIsDirtyForm(true);
    };

    // eslint-disable-next-line complexity
    const renderTabs = () => {
        switch (activeIndex) {
            case 0:
                return <Overview startDate={startDate} endDate={endDate} filteredIncidents={filteredUniqueIncidents} />;
            case 1:
                return <Incidents filteredIncidents={filteredUniqueIncidents} />;
            case 2:
                return <Top5 filteredIncidents={filteredUniqueIncidents} />;
            case 3:
                return (
                    <Quality
                        startDate={startDate}
                        endDate={endDate}
                        filteredDefects={filteredUniqueDefects}
                        selectedCovidTag={selectedCovidTag}
                        setIsApplyClicked={setIsApplyClicked}
                        handleBrandChange={handleBrandChange}
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
            <div id="filters-wrapper">
                <DatePicker
                    startDate={startDate}
                    endDate={endDate}
                    minDate={minDate}
                    handleDateRangeChange={handleDateRangeChange}
                    handleClearDates={handleClearDates}
                />
                <FilterDropDown id="priority-dropdown" list={currentPriorities} selectedValue={selectedPriority} onClickHandler={handlePriorityChange}/>
                <FilterDropDown id="brand-dropdown" list={BRANDS} selectedValue={selectedBrand} onClickHandler={handleBrandChange}/>
                <FilterDropDown id="status-dropdown" list={ALL_STATUSES} selectedValue={selectedStatus} onClickHandler={handleStatusChange}/>
                <Checkbox name="covid-19" label="covid-19" checked={selectedCovidTag} onChange={handleCovidTagChange}/>
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
            <Navigation
                noMobileSelect
                activeIndex={activeIndex}
                links={navLinks}
                onLinkClick={handleNavigationClick}
            />
            <LoadingContainer isLoading={isLoading} error={error} id={'incident-main'}>
                {renderTabs()}
            </LoadingContainer>
        </Fragment>
    );
};

export default IncidentTrendsDashboard;
