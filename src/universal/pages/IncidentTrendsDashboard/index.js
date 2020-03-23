import React, {Fragment, useState, useEffect} from 'react';
import moment from 'moment';
import 'moment-timezone';
import LoadingContainer from '../../components/LoadingContainer';
import FilterDropDown from '../../components/FilterDropDown';
import {Navigation} from '@homeaway/react-navigation';
import DatePicker from '../../components/DatePicker/index';
import {Checkbox} from '@homeaway/react-form-components';
import {getUniqueTickets, adjustTicketProperties} from './incidentsHelper';
import {DATE_FORMAT, PRIORITIES, BRANDS} from './constants';
import {Incidents, Overview, Top5, Quality, FinancialImpact} from './tabs/index';
import './styles.less';


const brandDefaultValue = 'All';
const priorityDefaultValue = 'All - P1 & P2';
const covidTagDefaultValue = true;
const startDateDefaultValue = moment().subtract(7, 'weeks').format(DATE_FORMAT);
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

    const applyFilters = () => {
        const isWithinRange = (t) => !(startDate || endDate) || !t.startedAt || moment(t.startedAt).isBetween(startDate, endDate, null, '[]');
        const matchesPriority = (t) => selectedPriority === priorityDefaultValue || t.priority === selectedPriority;
        const matchesBrand = (t) => selectedBrand === brandDefaultValue || t.Brand === selectedBrand;
        const matchesTag = (t) => !selectedCovidTag || t.tag.includes('covid-19');
        const filterTickets = (t) => isWithinRange(t) && matchesPriority(t) && matchesBrand(t) && matchesTag(t);
        // incidents
        setFilteredUniqueIncidents([...allUniqueIncidents].filter(filterTickets));
        setFilteredAllIncidents([...allIncidents].filter(filterTickets));
        // defects
        setFilteredUniqueDefects([...allUniqueDefects].filter(filterTickets));
        setIsDirtyForm(false);
    };

    useEffect(() => {
        Promise.all([fetch('/api/v1/incidents'), fetch('/api/v1/defects')])
            .then((responses) => Promise.all(responses.map((r) => r.json())))
            .then(([incidents, defects]) => {
                // incidents
                const uniqueIncidents = getUniqueTickets(incidents, 'incidentNumber');
                setAllUniqueIncidents(adjustTicketProperties(uniqueIncidents, 'incident'));
                setAllIncidents(incidents);
                // defects
                const uniqueDefects = getUniqueTickets(defects, 'defectNumber');
                setAllUniqueDefects(adjustTicketProperties(uniqueDefects, 'defect'));
                setAllDefects(defects);
                setIsLoading(false);
            })
            .catch((err) => {
                setError('Not all incidents and/or defects are available. Refresh the page to try again.');
                // eslint-disable-next-line no-console
                console.error(err);
            });
    }, []);

    useEffect(() => {
        applyFilters();
    }, [allUniqueIncidents, allIncidents, allUniqueDefects, allDefects]);

    const handleNavigationClick = (e, activeLinkIndex) => setActiveIndex(activeLinkIndex);

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
                return <Quality startDate={startDate} endDate={endDate} filteredDefects={filteredUniqueDefects} />;
            case 4:
                return <FinancialImpact filteredIncidents={filteredAllIncidents} />;
            default:
                return <Incidents filteredIncidents={filteredUniqueIncidents} />;
        }
    };

    return (
        <Fragment>
            <h1 className="page-title">{'Incidents trends'}</h1>
            <div id="filters-wrapper">
                <DatePicker
                    startDate={startDate}
                    endDate={endDate}
                    minDate={minDate}
                    handleDateRangeChange={handleDateRangeChange}
                    handleClearDates={handleClearDates}
                />
                <FilterDropDown id="priority-dropdown" list={PRIORITIES} selectedValue={selectedPriority} onClickHandler={handlePriorityChange}/>
                <FilterDropDown id="brand-dropdown" list={BRANDS} selectedValue={selectedBrand} onClickHandler={handleBrandChange}/>
                <Checkbox name="covid-19" label="Covid-19" checked={selectedCovidTag} onChange={handleCovidTagChange}/>
                <button
                    id="applyButton"
                    type="button"
                    className="btn btn-primary active"
                    onClick={applyFilters}
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
