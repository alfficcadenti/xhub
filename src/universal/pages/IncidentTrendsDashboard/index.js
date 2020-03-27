import React, {Fragment, useState, useEffect} from 'react';
import moment from 'moment';
import 'moment-timezone';
import LoadingContainer from '../../components/LoadingContainer';
import FilterDropDown from '../../components/FilterDropDown';
import {Navigation} from '@homeaway/react-navigation';
import DatePicker from '../../components/DatePicker/index';
import {Checkbox} from '@homeaway/react-form-components';
import {getUniqueTickets, adjustTicketProperties, getListOfUniqueProperties} from './incidentsHelper';
import {DATE_FORMAT, PRIORITIES, BRANDS, ALL_STATUSES} from './constants';
import {Incidents, Overview, Top5, Quality, FinancialImpact} from './tabs/index';
import './styles.less';

const statusDefaultValue = 'All Statuses';
const brandDefaultValue = 'All Brands';
const priorityDefaultValue = 'All - P1, P2 & P3';
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
    const [activeIndex, setActiveIndex] = useState(0);
    const [selectedStatus, setSelectedStatus] = useState(statusDefaultValue);
    const [selectedBrand, setSelectedBrand] = useState(brandDefaultValue);
    const [selectedCovidTag, setSelectedCovidTag] = useState(covidTagDefaultValue);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [startDate, setStartDate] = useState(startDateDefaultValue);
    const [endDate, setEndDate] = useState(endDateDefaultValue);
    const [selectedPriority, setSelectedPriority] = useState(priorityDefaultValue);
    const [isDirtyForm, setIsDirtyForm] = useState(false);
    // incidents
    const [allUniqueIncidents, setAllUniqueIncidents] = useState([]);
    const [filteredUniqueIncidents, setFilteredUniqueIncidents] = useState([]);
    const [allIncidents, setAllIncidents] = useState([]);
    const [filteredAllIncidents, setFilteredAllIncidents] = useState([]);
    // defects
    const [allUniqueDefects, setAllUniqueDefects] = useState([]);
    const [filteredUniqueDefects, setFilteredUniqueDefects] = useState([]);
    const [allDefects, setAllDefects] = useState([]);
    const [isApplyClicked, setIsApplyClicked] = useState(false);

    const [incidentsPriorities, setIncidentsPriorities] = useState([]);
    const [defectsPriorities, setDefectsPriorities] = useState([]);

    const [incidentsStatuses, setIncidentsStatuses] = useState([]);
    const [defectsStatuses, setDefectsStatuses] = useState([]);

    const [currentPriorities, seCurrentPriorities] = useState([]);
    const [currentStatuses, seCurrentStatuses] = useState([]);

    const applyFilters = () => {
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
    };

    useEffect(() => {
        setIsLoading(true);
        const query = new URLSearchParams(window.location.search);
        setSelectedCovidTag(query.get('covidFilter') === 'true');
        Promise.all([fetch(`https://opxhub-service.us-west-2.int.expedia.com/api/v1/incidents?startDate=${startDate}&endDate=${endDate}`), fetch(`https://opxhub-service.us-west-2.int.expedia.com/api/v1/defects?startDate=${startDate}&endDate=${endDate}`)])
            .then((responses) => Promise.all(responses.map((r) => r.json())))
            .then(([incidents, defects]) => {
                // incidents
                const uniqueIncidents = getUniqueTickets(incidents, 'incidentNumber');

                const adjustedUniqueIncidents = adjustTicketProperties(uniqueIncidents, 'incident');
                const incPriorities = getListOfUniqueProperties(adjustedUniqueIncidents, 'priority');
                const incStatuses = getListOfUniqueProperties(adjustedUniqueIncidents, 'Status');

                setIncidentsPriorities(incPriorities);
                setIncidentsStatuses(incStatuses);

                setAllUniqueIncidents(adjustedUniqueIncidents);
                setAllIncidents(incidents);
                // defects
                const uniqueDefects = getUniqueTickets(defects, 'defectNumber');

                const adjustedUniqueDefects = adjustTicketProperties(uniqueDefects, 'defect');
                const defPriorities = getListOfUniqueProperties(adjustedUniqueDefects, 'priority');
                const defStatuses = getListOfUniqueProperties(adjustedUniqueDefects, 'Status');

                setDefectsPriorities(defPriorities);
                setDefectsStatuses(defStatuses);

                setAllUniqueDefects(adjustedUniqueDefects);
                setAllDefects(defects);
                setIsLoading(false);
            })
            .catch((err) => {
                setIsLoading(false);
                setError('Not all incidents and/or defects are available. Refresh the page to try again.');
                // eslint-disable-next-line no-console
                console.error(err);
            });
    }, [isApplyClicked]);

    useEffect(() => {
        applyFilters();
    }, [allUniqueIncidents, allIncidents, allUniqueDefects, allDefects]);

    const handleNavigationClick = (e, activeLinkIndex) => {
        setActiveIndex(activeLinkIndex);

        switch (activeLinkIndex) {
            case 1:
                seCurrentPriorities(incidentsPriorities);
                seCurrentStatuses(incidentsStatuses);
                break;
            case 3:
                seCurrentPriorities(defectsPriorities);
                seCurrentStatuses(defectsStatuses);
                break;
            default:
                seCurrentPriorities(incidentsPriorities);
                seCurrentStatuses(incidentsStatuses);
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
                return <Quality startDate={startDate} endDate={endDate} filteredDefects={filteredUniqueDefects} selectedCovidTag={selectedCovidTag}/>;
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
                <FilterDropDown id="status-dropdown" list={currentStatuses} selectedValue={selectedStatus} onClickHandler={handleStatusChange}/>
                <Checkbox name="covid-19" label="covid-19" checked={selectedCovidTag} onChange={handleCovidTagChange}/>
                <button
                    id="applyButton"
                    type="button"
                    className="btn btn-primary active"
                    onClick={() => {
                        setIsApplyClicked(!isApplyClicked);
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
